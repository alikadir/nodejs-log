import express from "express";
import {writeLog} from "../services/logService.js";

const router = express.Router();


router.post('/info', (req, res) => {
    const message = req.query.message;
    const meta = req.body;

    setTimeout(() => {
        writeLog("info", message, meta)
        res.send("OK");
    }, 10000)
})

router.post('/error', (req, res) => {
    const message = req.query.message;
    const meta = req.body;
    writeLog("error", message, meta);
    res.send("OK");
})

router.post('/warn', async (req, res) => {
    const message = req.query.message;
    const meta = req.body;
    setTimeout(() => {
        writeLog("warn", message, meta);
        res.send("OK");
    },3000);
})

export default router;
