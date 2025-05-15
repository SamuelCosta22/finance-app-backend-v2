import { ZodError } from 'zod';
import { UnauthorizedError } from '../../errors/user.ts';
import { refreshTokenSchema } from '../../schemas/user.ts';
import { RefreshTokenUseCase } from '../../usecases/users/refresh-token.usecase.ts';
import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from '../helpers/http.ts';

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const params = httpRequest.body;
      await refreshTokenSchema.parseAsync(params);

      const tokens = await this.refreshTokenUseCase.execute(
        params.refreshToken,
      );

      const { statusCode, body } = success({ tokens });
      return { statusCode, body };
    } catch (error) {
      if (error instanceof ZodError)
        return badRequest({ message: error.errors[0].message });
      if (error instanceof UnauthorizedError) return unauthorized();
      console.error(error);
      return serverError();
    }
  }
}
