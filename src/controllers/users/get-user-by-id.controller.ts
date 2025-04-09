import { IGetUserByIdRepository } from '../../types/repositories/users.repository.ts';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  success,
  userNotFoundResponse,
} from './helpers/index.ts';

export class GetUserByIdController {
  constructor(private getUserByIdUseCase: IGetUserByIdRepository) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId);
      if (!isIdValid) {
        return invalidIdResponse();
      }

      const user = await this.getUserByIdUseCase.execute(
        httpRequest.params.userId,
      );

      if (!user) return userNotFoundResponse();

      const { statusCode, body } = success(user);
      return { statusCode, body };
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
