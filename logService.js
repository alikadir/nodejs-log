import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import expressWinston from 'express-winston';

const LOG_ELASTICSEARCH_ENDPOINT = process.env.LOG_ELASTICSEARCH_ENDPOINT;
const LOG_FILE_PATH = process.env.LOG_FILE_PATH;

const loggerOptions = {
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: LOG_FILE_PATH }),
    new ElasticsearchTransport({ clientOpts: { node: LOG_ELASTICSEARCH_ENDPOINT } }),
  ],
  responseWhitelist: ['body', 'statusCode'],
  requestWhitelist: ['body', 'headers'],
};

export const logger = winston.createLogger(loggerOptions);
export const loggerRequestResponseMiddleware = expressWinston.logger(loggerOptions);
export const loggerErrorMiddleware = expressWinston.errorLogger(loggerOptions);
