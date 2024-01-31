import { app } from './app.js';
import { log } from './logger.js';

const port = process.env.SERVER_PORT || 3000;
const server = app.listen(port);
log.logger.info(`Server listening on port ${port}`);

process.on('SIGTERM', () => {
  log.logger.debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    log.logger.debug('HTTP server closed');
  })
});
