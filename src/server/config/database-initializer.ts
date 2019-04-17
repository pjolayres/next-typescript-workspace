import 'reflect-metadata';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';

import logger, { LogLevel, LogLevels } from '../shared/logger';

import seedDatabase from './seed-database';

export default async () => {
  try {
    logger.info('Initializing database.');

    let connection!: Connection;

    if (process.env.NODE_ENV === 'test') {
      const config = require('../../../ormconfig.test.json') as ConnectionOptions;

      connection = await createConnection(config);
    } else {
      const config = {
        ...require('../../../ormconfig.json'),
        logging: LogLevel >= LogLevels.Debug
      } as ConnectionOptions;

      connection = await createConnection(config);
    }

    await seedDatabase();

    logger.info('Database initialized.');

    return connection;
  } catch (ex) {
    logger.error('Failed to initialize database.');
    logger.error(ex);

    throw ex;
  }
};
