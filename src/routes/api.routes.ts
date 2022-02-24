import { Router } from 'express';
import UserController from '../controllers/UserController';
import controller from '../lib/upload'

const route: Router = Router();

route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.get('/user', UserController.getUser)
route.post('/upload', controller);

export default route;
