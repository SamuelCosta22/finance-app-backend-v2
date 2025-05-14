import { ZodError } from 'zod';
import { loginSchema } from '../../schemas/user.ts';
import { ILoginUserUseCase } from '../../types/repositories/users.repository.ts';
import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from '../helpers/http.ts';
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.ts';
import { userNotFoundResponse } from '../helpers/invalid-response.ts';

export type HttpResponse<T = any> = {
  statusCode: number;
  body: T;
};

export class LoginUserController {
  constructor(private loginUserUseCase: ILoginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }

  async execute(httpRequest: any): Promise<HttpResponse> {
    try {
      const params = httpRequest.body;

      await loginSchema.parseAsync(params);

      const user = await this.loginUserUseCase.execute({
        email: params.email,
        password: params.password,
      });

      const { statusCode, body } = success(user);
      return { statusCode, body };
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }
      if (error instanceof InvalidPasswordError) {
        return unauthorized();
      }
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      console.error(error);
      return serverError();
    }
  }
}
