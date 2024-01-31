import { app } from './app.js';
import { Redis } from 'ioredis-mock';
import request from 'supertest';

jest.mock('./cacheService.js', () => jest.requireActual('ioredis-mock'));

describe('/health', () => {
  test('it returns 200 OK', async () => {
    const resp = await request(app).get('/health');

    expect(resp.status).toBe(200);
  });
});
