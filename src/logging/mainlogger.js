import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const mainLogger = winston.createLogger({
  level: 'info',
  format: combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'log/info.log' }),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  mainLogger.add(new winston.transports.Console({
    format: combine(
      timestamp(),
      printf(info => `${info.timestamp} - ${info.level} - [${info.thread}] ${info.message}`),
    ),
  }));
}

export default mainLogger;
