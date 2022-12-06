import express from 'express';
import cors from "cors";
import {
  logger,
  loggerErrorMiddleware,
  loggerRequestResponseMiddleware,
  loggerTrackDetectorMiddleware
} from './services/logService.js';
import userRouter from "./routers/userRouter.js";
import logRouter from "./routers/logRouter.js";
import HttpContext from "express-http-context";

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(loggerRequestResponseMiddleware);
app.use(HttpContext.middleware);
app.use(loggerTrackDetectorMiddleware)

app.use('/user',userRouter);
app.use('/log',logRouter)

app.use(loggerErrorMiddleware);

app.listen(3000, () => {
  logger.info('nodejs listens 3000 port');
});
