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
    const openWeatherMap = await getOpenWeatherMapData(`${city || Melbourne},AU`);
    const weatherStack = await getWeatherStackData(`${city || Melbourne},Australia`);
    res.status(200).json({
      message: `Hello ${city || 'Melbourne'}!`,
      openWeatherMap,
      weatherStack
    });
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
    console.log(`openweathermap: ${JSON.stringify(data)}`)
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
    console.log(`weatherstack: ${JSON.stringify(data)}`)
    return {
      wind_speed: data.current.wind_speed,
      temperature_degrees: data.current.temperature
    }
  }
  return undefined;
}

run();
