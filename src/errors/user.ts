export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`The email ${email} is already in use.`);
    this.name = 'EmailAlreadyInUseError';
  }
}
