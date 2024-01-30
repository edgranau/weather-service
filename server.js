import { app } from './app.js';
import { log } from './logger.js';


const port = process.env.SERVER_PORT || 3000;
app.listen(port);
log.logger.info(`Server listening on port ${port}`);
