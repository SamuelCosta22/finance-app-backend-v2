import { ZodError } from 'zod';
import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { createUserSchema } from '../../schemas/user.ts';
import { CreateUserParams } from '../../types/users/CreateUserParams.ts';
import { CreateUserUseCase } from '../../usecases/users/create-user.usecase.ts';
import { badRequest, created, serverError } from '../helpers/index.ts';

export type HttpRequest = {
  body: CreateUserParams;
};

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      await createUserSchema.parseAsync(params);

      const createdUser = await this.createUserUseCase.execute(params);

      return created({ createdUser });
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      console.log(error);
      return serverError();
    }
  }
}
