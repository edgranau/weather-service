import { app } from './app.js'
import request from "supertest";

describe('/health', () => {
  test("it returns 200 OK", async () => {
    const resp = await request(app).get("/health");

    expect(resp.status).toBe(200);
  });
});
