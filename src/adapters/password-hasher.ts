import bcrypt from 'bcrypt';

export interface IHashGeneratorAdapter {
  execute(password: string): Promise<string>;
}

export class PasswordHasherAdapter {
  async execute(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
