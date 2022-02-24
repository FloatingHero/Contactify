import bcrypt from 'bcrypt';

class Hash {

    crypt(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    compare(password: string, hashedPassword: string): Boolean {
        return bcrypt.compareSync(password, hashedPassword) ? true : false;
    }

}

export default new Hash;