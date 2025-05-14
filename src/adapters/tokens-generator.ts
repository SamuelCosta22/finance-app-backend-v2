import jwt from 'jsonwebtoken';

export interface ITokensGeneratorAdapter {
  execute(userId: string): {
    accessToken: string;
    refreshToken: string;
  };
}

export class TokensGeneratorAdapter implements ITokensGeneratorAdapter {
  execute(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error('JWT secrets not defined in environment variables.');
    }

    return {
      accessToken: jwt.sign({ userId }, accessTokenSecret, {
        expiresIn: '15m',
      }),
      refreshToken: jwt.sign({ userId }, refreshTokenSecret, {
        expiresIn: '30d',
      }),
    };
  }
}
