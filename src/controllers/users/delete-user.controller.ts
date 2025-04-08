import { DeleteUserUseCase } from '../../usecases/users/delete-user.usecase.ts';
import { serverError, success } from './helpers/http.ts';
import { invalidIdResponse } from './helpers/invalid-response.ts';
import { checkIfIdIsValid } from './helpers/validations.ts';

export class DeleteUserController {
  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.params.userId;
      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) return invalidIdResponse();

      const deleteUserUseCase = new DeleteUserUseCase();
      const deletedUser = deleteUserUseCase.execute(userId);

      const { statusCode, body } = success(deletedUser);
      return { statusCode, body };
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}
