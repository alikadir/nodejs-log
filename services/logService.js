import winston from 'winston';
import {ElasticsearchTransport} from 'winston-elasticsearch';
import expressWinston from 'express-winston';
import HttpContext from 'express-http-context'

const LOG_ELASTICSEARCH_ENDPOINT = process.env.LOG_ELASTICSEARCH_ENDPOINT;
const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
const TRACK_ID_NAME = 'my_track_id'

const loggerOptions = {
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({filename: LOG_FILE_PATH}),
        new ElasticsearchTransport({clientOpts: {node: LOG_ELASTICSEARCH_ENDPOINT}, retryLimit: -1}), //https://github.com/vanthome/winston-elasticsearch/issues/219
    ],
    responseWhitelist: ['body', 'statusCode'],
    requestWhitelist: ['body', 'headers'],
};
console.log(LOG_ELASTICSEARCH_ENDPOINT)
export const logger = winston.createLogger(loggerOptions);
export const loggerRequestResponseMiddleware = expressWinston.logger(loggerOptions);
export const loggerErrorMiddleware = expressWinston.errorLogger(loggerOptions);


export const loggerTrackDetectedMiddleware = (req, res, next) => {
    const myTrackId = req.get(TRACK_ID_NAME);
    if (myTrackId)
        HttpContext.set(TRACK_ID_NAME, myTrackId)

    next();
}

export const writeLog = (level, message, meta) => {
    const myTrackId = HttpContext.get(TRACK_ID_NAME);
    const metaData = myTrackId ? {myTrackId, ...meta} : meta;

    switch (level) {
        case "info":
            logger.info(message, metaData);
            break;
        case"error":
            logger.error(message, metaData);
            break;
        case "warn":
            logger.warn(message, metaData);
            break;
        default:
            logger.info(message, metaData);
            break;
    }
}
