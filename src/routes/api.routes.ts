import { Router } from 'express';
import UserController from '../controllers/UserController';

const route: Router = Router();

route.get('/getUsers', UserController.index);


export default route;