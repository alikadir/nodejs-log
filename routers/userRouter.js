import express from "express";
import {users} from "../services/userService.js";
import {logger} from "../services/logService.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.json(users);
});

router.get('/:id', (req, res) => {
    if (req.params.id) {
        const [first] = users;
        res.json(first);
        logger.info(`get user by id: ${req.params.id}`);
    }
});

router.post('/', (req, res) => {
    users.push(req.body);
    logger.info('user created', req.body);
    res.json(users);
});

router.delete('/', () => {
    throw 'user delete not allowed';
});

export default router;
