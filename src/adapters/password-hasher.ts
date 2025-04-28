import bcrypt from 'bcrypt';

export interface IHashGeneratorAdapter {
  execute(password: string): Promise<string>;
}

export class PasswordHasherAdapter {
  execute(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
