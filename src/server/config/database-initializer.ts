import { createConnection, ConnectionOptions } from 'typeorm';

import logger, { LogLevel, LogLevels } from '../shared/logger';

import seedDatabase from './seed-database';

export default async () => {
  try {
    logger.info('Initializing database.');

    const ormconfig = require('../../../ormconfig.json');

    if (process.env.NODE_ENV === 'test') {
      const config = {
        ...ormconfig,
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: true
      } as ConnectionOptions;

      await createConnection(config);
    } else {
      const config = {
        ...ormconfig,
        logging: LogLevel >= LogLevels.Debug
      } as ConnectionOptions;

      await createConnection(config);
    }

    await seedDatabase();

    logger.info('Database initialized.');
  } catch (ex) {
    logger.error('Failed to initialize database.');
    logger.error(ex);
  }
};
