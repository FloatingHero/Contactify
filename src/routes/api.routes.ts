import { Router, Request, Response } from 'express';
import UserController from '../controllers/UserController';
import upload from '../lib/upload';
import registerSchema from '../validations/register_validations';
import loginSchema from '../validations/login_validations';

const route: Router = Router();

route.post('/register', registerSchema, UserController.register);
route.post('/login', loginSchema, UserController.login);
route.get('/user', UserController.getUser);
route.post(
  '/upload',
  upload('profile_image_file'),
  (req: Request, res: Response) => {
    res.json('Archivo subido');
  }
);

export default route;
