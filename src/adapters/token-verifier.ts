import jwt from 'jsonwebtoken';

export interface ITokenVerifierAdapter {
  execute(token: string, secret: string);
}

export class TokenVerifierAdapter {
  execute(token: string, secret: string) {
    return jwt.verify(token, secret);
  }
}
