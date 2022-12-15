import winston from 'winston';
import expressWinston from 'express-winston';
import HttpContext from 'express-http-context'
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest.js';
import {UAParser} from 'ua-parser-js'


const LOG_LOGSTASH_HOST = process.env.LOG_LOGSTASH_HOST;
const LOG_LOGSTASH_PORT = process.env.LOG_LOGSTASH_PORT;

const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
const TRANSACTION_HEADER_AND_CONTEXT_NAME = 'transaction'
const DEVICE_INFO_NAME = 'deviceInfo'

const loggerOptions = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: LOG_FILE_PATH}),
        new LogstashTransport({
            port: LOG_LOGSTASH_PORT,
            host: LOG_LOGSTASH_HOST
        })
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

    const userAgent = req.get('user-agent');
    let parser = new UAParser(userAgent);

    const deviceInfo = {
        device: parser.getDevice(),
        os: parser.getOS(),
        browser: parser.getBrowser(),
        engine: parser.getEngine()
    }

    HttpContext.set(DEVICE_INFO_NAME, deviceInfo)

    next();
}

export const writeLog = (level, message, meta) => {

    const transaction = HttpContext.get(TRANSACTION_HEADER_AND_CONTEXT_NAME);
    const deviceInfo = HttpContext.get(DEVICE_INFO_NAME);

    let metaData;
    if (transaction && deviceInfo)
        metaData = {transaction, deviceInfo, ...meta}
    else if (transaction)
        metaData = {transaction, ...meta}
    else if (deviceInfo)
        metaData = {deviceInfo, ...meta}
    else
        metaData = {...meta}

    switch (level) {
        case "info":
            loggerWinston.info(message, {meta: metaData});
            break;
        case"error":
            loggerWinston.error(message, {meta: metaData});
            break;
        case "warn":
            loggerWinston.warn(message, {meta: metaData});
            break;
        default:
            loggerWinston.info(message, {meta: metaData});
            break;
    }
}
