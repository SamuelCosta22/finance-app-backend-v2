export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`The email ${email} is already in use.`);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class UserNotFoundError extends Error {
  constructor(userId?: string) {
    super(`User with id ${userId} not found.`);
    this.name = 'UserNotFoundError';
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Invalid password.');
    this.name = 'InvalidPasswordError';
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Forbidden.');
    this.name = 'ForbiddenError';
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized.');
    this.name = 'UnauthorizedError';
  }
}
