import express from 'express';
import {
  logger,
  loggerErrorMiddleware,
  loggerRequestResponseMiddleware,
  loggerTrackDetectedMiddleware
} from './services/logService.js';
import userRouter from "./routers/userRouter.js";
import logRouter from "./routers/logRouter.js";
import HttpContext from "express-http-context";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(loggerRequestResponseMiddleware);
app.use(HttpContext.middleware);
app.use(loggerTrackDetectedMiddleware)

app.use('/user',userRouter);
app.use('/log',logRouter)

app.use(loggerErrorMiddleware);

app.listen(3000, () => {
  logger.info('nodejs listens 3000 port');
});
