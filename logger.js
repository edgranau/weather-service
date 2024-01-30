import logger from 'pino-http';
export const log = logger({ name: 'weather-service', level: 'info', autoLogging: false });
