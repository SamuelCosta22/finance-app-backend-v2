import bcrypt from 'bcrypt';

export interface IPasswordComparatorAdapter {
  execute(password: string, hashedPassword: string): Promise<boolean>;
}

export class PasswordComparatorAdapter {
  async execute(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
