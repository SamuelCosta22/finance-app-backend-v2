import jwt from 'jsonwebtoken';

export interface ITokenVerifierAdapter {
  execute(token: string, secret: string);
}

export class TokenVerifierAdapter {
  execute(token: string, secret: string) {
    jwt.verify(token, secret);
  }
}
