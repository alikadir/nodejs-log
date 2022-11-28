import express from 'express';
import { logger, loggerErrorMiddleware, loggerRequestResponseMiddleware } from './services/logService.js';
import userRouter from "./routers/userRouter.js";
import logRouter from "./routers/logRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(loggerRequestResponseMiddleware);

app.use('/user',userRouter);
app.use('/log',logRouter)

app.use(loggerErrorMiddleware);

app.listen(1453, () => {
  logger.info('nodejs listens 1453 port');
});
