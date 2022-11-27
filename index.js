import express from 'express';
import { logger, loggerErrorMiddleware, loggerRequestResponseMiddleware } from './logService.js';
import { users } from './userService.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(loggerRequestResponseMiddleware);

app.get('/user', (req, res) => {
  res.json(users);
});

app.get('/user/:id', (req, res) => {
  if (req.params.id) {
    const [first] = users;
    res.json(first);
    logger.info(`get user by id: ${req.params.id}`);
  }
});

app.post('/user', (req, res) => {
  users.push(req.body);
  logger.info('user created', req.body);
  res.json(users);
});

app.delete('/user', (req, res) => {
  throw 'user delete not allowed';
});

app.use(loggerErrorMiddleware);

app.listen(1453, () => {
  logger.info('nodejs listens 1453 port');
});
