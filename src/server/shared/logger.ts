import winston, { format, transports } from 'winston';
import moment from 'moment';
import fs from 'fs';
import { Format } from 'logform';

const { combine, timestamp, colorize, splat, printf, errors, json } = format;

const date = moment();
const fileTimestamp = date.format('YYYY-MM-DD_HH-mm-ss');
const defaultConsoleLogLevel = process.env.NODE_ENV === 'test' ? 'error' : 'debug';
const defaultFileLogLevel = 'error';

interface LogLevelsType {
  [key: string]: number;
}

export const LogLevels: LogLevelsType = {
  Error: 0,
  Warn: 1,
  Info: 2,
  Verbose: 3,
  Debug: 4,
  Silly: 5
};

let logLevel = LogLevels.Error;

Object.keys(LogLevels).forEach(key => {
  if (key.toUpperCase() === (process.env.LOG_LEVEL || '').toUpperCase()) {
    logLevel = LogLevels[key];
  }
});

export const LogLevel = logLevel;

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
