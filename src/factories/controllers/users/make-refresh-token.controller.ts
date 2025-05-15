import { TokenVerifierAdapter } from '../../../adapters/token-verifier.ts';
import { TokensGeneratorAdapter } from '../../../adapters/tokens-generator.ts';
import { RefreshTokenController } from '../../../controllers/users/refresh-token.controller.ts';
import { RefreshTokenUseCase } from '../../../usecases/users/refresh-token.usecase.ts';

export const makeRefreshTokenController = () => {
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const tokenVerifierAdapter = new TokenVerifierAdapter();
  const refreshTokenUseCase = new RefreshTokenUseCase(
    tokensGeneratorAdapter,
    tokenVerifierAdapter,
  );
  const refreshTokenController = new RefreshTokenController(
    refreshTokenUseCase,
  );

  return refreshTokenController;
};
