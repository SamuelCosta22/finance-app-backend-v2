import { GetUserByIdUseCase } from '../../usecases/users/get-user-by-id.usecase.ts';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  success,
  userNotFoundResponse,
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

      if (!user) return userNotFoundResponse();

      const { statusCode, body } = success(user);
      return { statusCode, body };
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
