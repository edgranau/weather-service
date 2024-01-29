import axios from 'axios';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import qs from 'qs';

const run = async () => {
  await startServer();
}

const startServer = async () => {
  const app = express();
  const port = 3000;

  app.use('*', helmet(), cors());

  app.get('/v1/weather', async (req, res) => {
    const { city } = qs.parse(req.query);
    let response = await getWeatherStackData(`${city || Melbourne},Australia`);
    if (response) {
      console.log(`responding with data from weatherStack: ${JSON.stringify(response)}`);
    }
    else {
      response = await getOpenWeatherMapData(`${city || Melbourne},AU`);
      if (response) {
        console.log(`1st failover. responding with data from openWeatherMap: ${JSON.stringify(response)}`);
      }
      else {
        response = {
          wind_speed: 5,
          temperature_degrees: 18
        };
        console.log(`2nd failover. responding with data from cache (to be implemented): ${JSON.stringify(response)}`);
      }
    }
    res.status(200).json(response);
  });

  await new Promise(resolve => app.listen(port, resolve));

  console.log(`Server listening on port ${port}`);

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
