import axios from 'axios';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import logger from 'pino-http';
import { createClient } from 'redis';
import qs from 'qs';

const run = async () => {
  await startServer();
}

const startServer = async () => {
  const app = express();
  const port = 3000;
  const redisClient = await createClient({
    socket: {
      host: process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_PORT || 6379,
    }
  })
    .on('error', err => logger().logger.error('Redis Client Error', err))
    .connect();

  app.use('*', helmet(), cors(), logger({name: 'weather-service', level: 'info', autoLogging: false}));

  app.get('/v1/weather', async (req, res) => {
    const { city } = qs.parse(req.query);
    let response = await redisClient.get(city);
    if (response) {
      req.log.info(`responding with data from cache: ${JSON.stringify(response)}`);
    }
    else {
      response = await getWeatherStackData(`${city || Melbourne},Australia`);
      if (response) {
        req.log.info(`responding with data from weatherStack: ${JSON.stringify(response)}`);
      }
      else {
        response = await getOpenWeatherMapData(`${city || Melbourne},AU`);
        if (response) {
          req.log.info(`failover. responding with data from openWeatherMap: ${JSON.stringify(response)}`);
        }
        else {
          req.log.error(`weather services offline and no cached data for ${city}`);
          res.status(500).json({ message: `weather services offline and no cached data for ${city}` });
        }
      }
      await redisClient.set(city, JSON.stringify(response), { EX: 3 });
    }
    res.status(200).json(response);
  });

  await new Promise(resolve => app.listen(port, resolve));

  logger().logger.info(`Server listening on port ${port}`);

}

export const getOpenWeatherMapData = async (query) => {
  const params = {
    appid: process.env.OPEN_WEATHER_MAP_API_KEY || '',
    q: query,
    units: 'metric'
  }

  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params });
  if (data) {
    return {
      wind_speed: data.wind.speed * 3.6, // convert m/s to km/h
      temperature_degrees: data.main.temp
    }
  }
  return undefined;
}

export const getWeatherStackData = async (query) => {
  const params = {
    access_key: process.env.WEATHER_STACK_API_KEY || '',
    query,
}

  const { data } = await axios.get('http://api.weatherstack.com/current', { params });
  if (data) {
    return {
      wind_speed: data.current.wind_speed,
      temperature_degrees: data.current.temperature
    }
  }
  return undefined;
}

run();
