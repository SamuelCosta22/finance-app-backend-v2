import validator from 'validator';
import { GetUserByIdUseCase } from '../../usecases/users/get-user-by-id.usecase.ts';
import { notFound, serverError, success } from './helpers/http.ts';
import { invalidIdResponse } from './helpers/invalid-response.ts';

export class GetUserByIdController {
  async execute(httpRequest: any) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId);
      if (!isIdValid) {
        return invalidIdResponse();
      }

      const getUserByIdUseCase = new GetUserByIdUseCase();
      const user = await getUserByIdUseCase.execute(httpRequest.params.userId);

      if (!user) return notFound({ message: 'User not found' });

      const { statusCode, body } = success(user);
      return { statusCode, body };
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
