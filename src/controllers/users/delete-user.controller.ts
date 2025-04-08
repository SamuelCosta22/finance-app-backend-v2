import { DeleteUserUseCase } from '../../usecases/users/delete-user.usecase.ts';
import {} from './helpers/http.ts';
import {
  invalidIdResponse,
  userNotFoundResponse,
  serverError,
  success,
  checkIfIdIsValid,
} from './helpers/index.ts';

export class DeleteUserController {
  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.params.userId;
      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) return invalidIdResponse();

      const deleteUserUseCase = new DeleteUserUseCase();
      const deletedUser = deleteUserUseCase.execute(userId);

      if (!deletedUser) {
        return userNotFoundResponse();
      }

      const { statusCode, body } = success(deletedUser);
      return { statusCode, body };
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}
