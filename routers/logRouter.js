import express from "express";
import {logger} from "../services/logService.js";

const router = express.Router();


const writeLog = (level, message, meta) => {
    switch (level) {
        case "info":
            logger.info(message, meta);
            break;
        case"error":
            logger.error(message, meta);
            break;
        case "warn":
            logger.warn(message, meta);
            break;
        default:
            logger.info(message, meta);
            break;
    }
}

router.post('/info', (req, res) => {
    const message = req.query.message;
    const meta = req.body;
    writeLog("info", message, meta)
    res.send("OK");
})

router.post('/error', (req, res) => {
    const message = req.query.message;
    const meta = req.body;
    writeLog("error", message, meta);
    res.send("OK");
})

router.post('/warn', (req, res) => {
    const message = req.query.message;
    const meta = req.body;
    writeLog("warn", message, meta);
    res.send("OK");
})

export default router;
