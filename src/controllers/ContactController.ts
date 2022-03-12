import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../models/User';
import { Contact } from '../models/Contact';

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

    return res.json(contact);
  }
}

export default new ContactController();
