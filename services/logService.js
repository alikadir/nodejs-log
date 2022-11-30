import winston from 'winston';
import {ElasticsearchTransport} from 'winston-elasticsearch';
import expressWinston from 'express-winston';
import HttpContext from 'express-http-context'

const LOG_ELASTICSEARCH_ENDPOINT = process.env.LOG_ELASTICSEARCH_ENDPOINT;
const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
const TRANSACTION_HEADER_AND_CONTEXT_NAME = 'transaction'

const loggerOptions = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: LOG_FILE_PATH}),
        new ElasticsearchTransport({clientOpts: {node: LOG_ELASTICSEARCH_ENDPOINT}, retryLimit: -1}), //https://github.com/vanthome/winston-elasticsearch/issues/219
    ],
    responseWhitelist: ['body', 'statusCode'],
    requestWhitelist: ['body', 'headers'],
};

const loggerWinston = winston.createLogger(loggerOptions);
export const loggerRequestResponseMiddleware = expressWinston.logger(loggerOptions);
export const loggerErrorMiddleware = expressWinston.errorLogger(loggerOptions);

export const logger = {
    info: (message, meta) => writeLog('info', message, meta),
    warn: (message, meta) => writeLog('warn', message, meta),
    error: (message, meta) => {
        if (meta instanceof Error)
            writeLog('error', message, {error: {name: meta.name, message: meta.message, stack: meta.stack}});
        else
            writeLog('error', message, meta);
    }
}

export const loggerTrackDetectedMiddleware = (req, res, next) => {
    const transactionBase64 = req.get(TRANSACTION_HEADER_AND_CONTEXT_NAME);
    if (transactionBase64) {
        const transactionString = Buffer.from(transactionBase64, 'base64').toString('utf8');
        const transaction = JSON.parse(transactionString)
        HttpContext.set(TRANSACTION_HEADER_AND_CONTEXT_NAME, transaction)
    }

    next();
}

export const writeLog = (level, message, meta) => {
    debugger
    const transaction = HttpContext.get(TRANSACTION_HEADER_AND_CONTEXT_NAME);
    const metaData = transaction ? {transaction, ...meta} : {...meta};

    switch (level) {
        case "info":
            loggerWinston.info(message, metaData);
            break;
        case"error":
            loggerWinston.error(message, metaData);
            break;
        case "warn":
            loggerWinston.warn(message, metaData);
            break;
        default:
            loggerWinston.info(message, metaData);
            break;
    }
}
