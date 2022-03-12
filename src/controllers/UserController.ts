import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../models/User';
import bcrypt from '../lib/bcrypt';
import jwt from 'jsonwebtoken';
import { Result, ValidationError, validationResult } from 'express-validator';

class UserController {
  /**
   * insert a new user into database
   * @param req
   * @param res
   * @returns Promise<Response>
   */
  async register(req: Request, res: Response): Promise<Response> {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array({
          onlyFirstError: true,
        }),
      });
    } else {
      const { name, email, password, image_name } = req.body;
      const user = getManager().create(User, {
        name: name,
        email: email,
        password: bcrypt.crypt(password),
        profile_image: image_name,
      });

      await getManager().save(user);

      return res.status(201).json('¡Registro exitoso!');
    }
  }

  /**
   * get token of current user
   * @param req
   * @param res
   */
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

  /**
   * attempt to login and creates a token
   * @param req
   * @param res
   * @returns a generated token if login was succesfull or an error
   */
  async login(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array({
          onlyFirstError: true,
        }),
      });
    }

    const user = await getManager().findOneOrFail(User, {
      email: req.body.email,
    });

    if (
      user === undefined ||
      !bcrypt.compare(req.body.password, user.password)
    ) {
      return res.status(422).json({
        errors: [
          {
            msg: 'Las credenciales no coinciden con ninguno de nuestros registros. Por favor, vuelva a intentarlo.',
          },
        ],
      });
    }

    jwt.sign(
      { user: user },
      process.env.JWT_PRIVATE_KEY!,
      { expiresIn: '1h' },
      (err: any, token: any) => {
        return err === null
          ? res.status(200).json(token)
          : res.status(500).json(err);
      }
    );
  }
}

export default new UserController();
