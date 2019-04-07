import winston, { format, transports } from 'winston';
import moment from 'moment';
import fs from 'fs';
import { Format } from 'logform';

const { combine, timestamp, colorize, splat, printf, errors, json } = format;

const date = moment();
const fileTimestamp = date.format('YYYY-MM-DD_HH-mm-ss');
const defaultConsoleLogLevel = 'debug';
const defaultFileLogLevel = 'error';

fs.mkdir('./logs', () => {
  /* no-op */
});

// Only include colorization and human-readable logs during development. Production environment will always log to file in JSON format.
const combinedFormats = [
  timestamp(),
  process.env.NODE_ENV !== 'production' ? colorize() : null,
  splat(),
  errors({ stack: true }),
  json(),
  process.env.NODE_ENV !== 'production' ? printf(info => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`) : null
].filter(item => item != null) as Format[];

const logger = winston.createLogger({
  format: combine(...combinedFormats),
  transports: [
    process.env.NODE_ENV !== 'production'
      ? new transports.Console({ level: process.env.LOG_LEVEL || defaultConsoleLogLevel })
      : new transports.File({
        filename: `./logs/${fileTimestamp}_log.log`,
        level: process.env.LOG_LEVEL || defaultFileLogLevel,
        maxsize: 1024 * 1024 * 10 // 10 MB rolling log files
      })
  ]
});

logger.log('info', `Logger set to "${logger.transports[0].level}"`);

/*
Logging levels are as follows:
  error: 0
  warn: 1
  info: 2
  verbose: 3
  debug: 4
  silly: 5
*/

export default {
  debug: (message: any, ...args: any[]) => {
    logger.debug(message, ...args);
  },
  verbose: (message: any, ...args: any[]) => {
    logger.verbose(message, ...args);
  },
  info: (message: any, ...args: any[]) => {
    logger.info(message, ...args);
  },
  warn: (message: any, ...args: any[]) => {
    logger.warn(message, ...args);
  },
  error: (message: any, ...args: any[]) => {
    logger.error(message, ...args);
  }
};
