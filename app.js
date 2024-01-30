import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { log } from './logger.js';
import qs from 'qs';
import { cacheClient } from './cacheService.js';
import { getOpenWeatherMapData, getWeatherStackData } from './weatherProviders.js';

await cacheClient.connect();

const app = express();

app.use('*', helmet(), cors(), log);

app.get('/v1/weather', async (req, res) => {
  const { city } = qs.parse(req.query);
  let response = await cacheClient.get(city, (reply) => JSON.parse(reply));
  if (response) {
    req.log.info(`responding with data from cache: ${response}`);
  } else {
    response = await getWeatherStackData(`${city || 'Melbourne'},Australia`);
    if (response) {
      req.log.info(`responding with data from weatherStack: ${JSON.stringify(response)}`);
    } else {
      response = await getOpenWeatherMapData(`${city || 'Melbourne'},AU`);
      if (response) {
        req.log.info(`failover. responding with data from openWeatherMap: ${JSON.stringify(response)}`);
      } else {
        req.log.error(`weather services offline and no cached data for ${city}`);
        res.status(500).json({ message: `weather services offline and no cached data for ${city}` });
      }
    }
    await cacheClient.set(city, JSON.stringify(response), { EX: 3 }); // set value in cache with a TTL of 3sec
  }
  res.status(200).json(response);
});

app.get('/health', (_req, res) => res.status(200).json({ status: 'OK' }));

export { app };
