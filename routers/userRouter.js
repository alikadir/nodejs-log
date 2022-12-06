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
        logger.info(`Send user by id: ${req.params.id} from Server - Backend`, {sendUser: first});
    }
});

router.post('/', (req, res) => {
    users.push(req.body);
    logger.info('user created', req.body);
    res.json(users);
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    logger.info('DENEME - Cannot delete user that is admin! from Server', {userId});
    logger.error('Cannot delete user that is admin! from Server', {userId});
    res.status(401).send("user delete not allowed"); // unauthorized
});

export default router;
