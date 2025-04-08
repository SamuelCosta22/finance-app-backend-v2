import { GetUserByIdUseCase } from '../../usecases/users/get-user-by-id.usecase.ts';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  notFound,
  serverError,
  success,
} from './helpers/index.ts';

export class GetUserByIdController {
  async execute(httpRequest: any) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId);
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
