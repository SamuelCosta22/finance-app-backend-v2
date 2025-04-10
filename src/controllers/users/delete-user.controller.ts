import { IDeleteUserRepository } from '../../types/repositories/users.repository.ts';
import {
  invalidIdResponse,
  userNotFoundResponse,
  serverError,
  success,
  checkIfIdIsValid,
} from './helpers/index.ts';

export class DeleteUserController {
  constructor(private deleteUserUseCase: IDeleteUserRepository) {
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.params.userId;
      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) return invalidIdResponse();

      const deletedUser = await this.deleteUserUseCase.execute(userId);

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
