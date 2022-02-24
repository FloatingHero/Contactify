import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';
import { User } from '../models/User';
import bcrypt from '../lib/bcrypt';
import jwt from 'jsonwebtoken';
import upload from '../lib/upload';

class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = bcrypt.crypt(req.body.password);
    await getRepository(User).save(user);
    return res.json('¡Registro exitoso!');
  }

  getUser(req: Request, res: Response) {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader !== undefined) {
      const bearerToken = bearerHeader.split(' ')[1];
      jwt.verify(
        bearerToken,
        process.env.JWT_PRIVATE_KEY!,
        (err: any, authData: any) => {
          if (err) {
            return res.json({
              message: 'invalid token',
            });
          }

          return res.json(authData);
        }
      );
    }
  }

  async login(req: Request) {
    const user = await getManager().findOneOrFail(User, {
      email: req.body.email,
    });

    if (bcrypt.compare(req.body.password, user.password)) {
      jwt.sign(
        { user: user },
        process.env.JWT_PRIVATE_KEY!,
        { expiresIn: '1h' },
        (err: any, token: any) => {
          return err === null ? token : err;
        }
      );
    } else {
      //todo display error message
    }
  }
}

export default new UserController();
