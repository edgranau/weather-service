import axios from 'axios';
import { log } from './logger.js';

export const parseOpenWeatherMapData = (response) => {
  return {
      wind_speed: response.data.wind.speed * 3.6, // convert m/s to km/h
      temperature_degrees: response.data.main.temp
    };
}

export const getOpenWeatherMapData = async (query) => {
  const params = {
    appid: process.env.OPEN_WEATHER_MAP_API_KEY || '',
    q: query,
    units: 'metric'
  };

  const url = 'https://api.openweathermap.org/data/2.5/weather';

  return callProvider(url, params, parseOpenWeatherMapData);
}

export const parseWeatherStackData = (response) => {
  return {
      wind_speed: response.data.current.wind_speed,
      temperature_degrees: response.data.current.temperature
    };
}

export const getWeatherStackData = async (query) => {
  const params = {
    access_key: process.env.WEATHER_STACK_API_KEY || '',
    query,
  };

  const url = 'http://api.weatherstack.com/current';

  return callProvider(url, params, parseWeatherStackData);
}

const callProvider = async (url, params, parser) => {
  try {
    const response = await axios.get(url, { params });
    return parser(response);
  } catch (error) {
    log.logger.info(JSON.stringify(error));
    return undefined;
  }
}
