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

  app.get('/v1/weather', (req, res) => {
    const { city } = qs.parse(req.query);
    res.status(200).json({ message: `Hello ${city || 'Melbourne'}!` });
  });

  await new Promise(resolve => app.listen(port, resolve));

  console.log(`Server listening on port ${port}`);

}

run();
