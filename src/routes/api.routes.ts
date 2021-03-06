import { Router, Request, Response } from 'express';
import UserController from '../controllers/UserController';
import upload from '../lib/upload';
import registerSchema from '../validations/register_validations';
import loginSchema from '../validations/login_validations';
import ContactController from '../controllers/ContactController';
import contactSchema from '../validations/contact_validations';

const route: Router = Router();

route.get('/', (req, res) => {
  res.send('Hola');
});
route.post('/register', registerSchema, UserController.register);
route.post('/login', loginSchema, UserController.login);
route.get('/user', UserController.getUser);
route.post('/upload', upload('image'), (req: Request, res: Response) => {
  res.json('Archivo subido');
});

route.get('/contacts/:user_id', ContactController.index);
route.post('/contact/store', contactSchema, ContactController.store);
route.post('/contact/delete/:id', ContactController.delete);
route.get('/contact/:id', ContactController.getContact);
route.post('/contact/edit', contactSchema, ContactController.editContact);

export default route;
