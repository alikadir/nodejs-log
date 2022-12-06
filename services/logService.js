import winston from 'winston';
//import {ElasticsearchTransport} from 'winston-elasticsearch';
import expressWinston from 'express-winston';
import HttpContext from 'express-http-context'
//import LogstashTransport from 'winston3-logstash-transport';
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest.js';

const LOG_ELASTICSEARCH_ENDPOINT = process.env.LOG_ELASTICSEARCH_ENDPOINT;
const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
const TRANSACTION_HEADER_AND_CONTEXT_NAME = 'transaction'
const DEVICE_INFO_NAME = 'deviceInfo'

const loggerOptions = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: LOG_FILE_PATH}),
        new LogstashTransport({
            port: 28777,
            node_name: 'my node name',
            host: '127.0.0.1'
        })
        /*
         new LogstashTransport({
             mode: 'udp',
             host: LOG_ELASTICSEARCH_ENDPOINT,
             port: 28777
         }),
         */

        //new ElasticsearchTransport({clientOpts: {node: LOG_ELASTICSEARCH_ENDPOINT}, retryLimit: -1}), //https://github.com/vanthome/winston-elasticsearch/issues/219
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

export const loggerTrackDetectorMiddleware = (req, res, next) => {
    const transactionBase64 = req.get(TRANSACTION_HEADER_AND_CONTEXT_NAME);
    if (transactionBase64) {
        const transactionString = Buffer.from(transactionBase64, 'base64').toString('utf8');
        const transaction = JSON.parse(transactionString)
        HttpContext.set(TRANSACTION_HEADER_AND_CONTEXT_NAME, transaction)
    }

    next();
}

export const loggerDeviceInfoDetectorMiddleware = (req, res, next) => {
    const userAgent = req.userAgent;
    const deviceInfo = {} //TODO: parse userAgent
    HttpContext.set(DEVICE_INFO_NAME, deviceInfo)

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
