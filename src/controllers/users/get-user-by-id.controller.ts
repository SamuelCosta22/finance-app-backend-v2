import { GetUserByIdUseCase } from '../../usecases/users/get-user-by-id.usecase.ts';
import { badRequest, serverError, success } from '../helpers.ts';
import validator from 'validator';

export class GetUserByIdController {
  async execute(httpRequest: any) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId);
      if (!isIdValid) {
        return badRequest({
          message: 'The provided ID is not valid.',
        });
      }

      const getUserByIdUseCase = new GetUserByIdUseCase();
      const user = await getUserByIdUseCase.execute(httpRequest.params.userId);

      const { statusCode, body } = success(user);
      return { statusCode, body };
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
