import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import { User } from '../models/User';
import { Contact } from '../models/Contact';
import * as fs from 'fs';
import { Result, ValidationError, validationResult } from 'express-validator';
import upload from '../lib/upload';

class ContactController {
  async index(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;

    const user: User = await getManager().findOneOrFail(User, user_id, {
      relations: ['contacts'],
    });

    const contacts: Contact[] = user.contacts;

    return contacts === undefined
      ? res.status(404).json('No hay ningún contacto registrado')
      : res.json(contacts);
  }

  async store(req: Request, res: Response): Promise<any> {
    const { name, surname, email, tel, image_name, user_id } = req.body;
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    const contact: Contact = getManager().create(Contact, {
      name: name,
      surname: surname,
      email: email,
      tel: tel,
      image: image_name,
    });

    await getManager().save(contact);

    const user: User = await getManager().findOneOrFail(User, user_id, {
      relations: ['contacts'],
    });

    user.contacts.push(contact);

    getManager().save(user);

    return res.json('¡Contacto creado con éxito!');
  }

  async delete(req: Request, res: Response) {
    const contact = await getManager().findOneOrFail(Contact, req.params.id);
    const fileToDelete = `src/public/img/${contact.image}`;

    if (fs.existsSync(fileToDelete)) {
      fs.rmSync(fileToDelete, { force: true });
    }

    getManager().remove(contact);

    return res.json('¡Contacto eliminado con éxito!');
  }

  async getContact(req: Request, res: Response): Promise<Response> {
    const contact: Contact = await getManager().findOneOrFail(
      Contact,
      req.params.id
    );

    return res.json(contact);
  }

  async editContact(req: Request, res: Response) {
    const { id, name, surname, email, tel, image_name } = req.body;
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    const contact: Contact = await getRepository(Contact).findOneOrFail(id);

    if (image_name !== contact.image) {
      const fileToDelete = `src/public/img/${contact.image}`;

      if (fs.existsSync(fileToDelete)) {
        fs.rmSync(fileToDelete);
      }
    }

    getRepository(Contact).merge(contact, {
      name,
      surname,
      email,
      tel,
      image: image_name,
    });

    await getRepository(Contact).save(contact);

    return res.json('¡Contacto editado con éxito');
  }
}

export default new ContactController();
