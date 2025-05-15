import { ITokenVerifierAdapter } from '../../adapters/token-verifier.ts';
import { ITokensGeneratorAdapter } from '../../adapters/tokens-generator.ts';
import { UnauthorizedError } from '../../errors/user.ts';

export class RefreshTokenUseCase {
  constructor(
    private tokenGeneratorAdapter: ITokensGeneratorAdapter,
    private tokenVerifierAdapter: ITokenVerifierAdapter,
  ) {
    this.tokenGeneratorAdapter = tokenGeneratorAdapter;
    this.tokenVerifierAdapter = tokenVerifierAdapter;
  }

  execute(refreshToken: string) {
    try {
      const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

      if (!refreshTokenSecret) {
        throw new Error('JWT secrets not defined in environment variables.');
      }

      const decodedToken = this.tokenVerifierAdapter.execute(
        refreshToken,
        refreshTokenSecret,
      );

      if (!decodedToken) {
        throw new UnauthorizedError();
      }

      return this.tokenGeneratorAdapter.execute(decodedToken.userId);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedError();
    }
  }
}
