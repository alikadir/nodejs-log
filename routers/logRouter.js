import express from "express";
import {writeLog} from "../services/logService.js";

const router = express.Router();


router.post('/info', (req, res) => {
    const message = req.query.message;
    const meta = req.body;
    debugger
    writeLog("info", message, meta)
    res.send("OK");

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
    writeLog("warn", message, meta);
    res.send("OK");
})

export default router;
