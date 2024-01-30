/* eslint-disable no-undef */
import { createClient } from 'redis';
import RedisJsonModule from '@redis/json';

const socket = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

const modules = {
  json: RedisJsonModule
};

export const cacheClient = createClient({ socket, modules });
