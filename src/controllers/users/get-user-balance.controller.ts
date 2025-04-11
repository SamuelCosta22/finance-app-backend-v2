import { UserNotFoundError } from '../../errors/user.ts';
import { IGetUserBalanceRepository } from '../../types/repositories/users.repository.ts';
import { serverError, success } from '../helpers/http.ts';
import {
  invalidIdResponse,
  userNotFoundResponse,
} from '../helpers/invalid-response.ts';
import { checkIfIdIsValid } from '../helpers/validations.ts';

export class GetUserBalanceController {
  constructor(private getUserBalanceUsecase: IGetUserBalanceRepository) {
    this.getUserBalanceUsecase = getUserBalanceUsecase;
  }

  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.params.userId;
      const idIsValid = checkIfIdIsValid(userId);
      if (!idIsValid) return invalidIdResponse();

      const balance = await this.getUserBalanceUsecase.execute(userId);
      const { statusCode, body } = success(balance);
      return { statusCode, body };
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      console.error(error);
      return serverError();
    }
  }
}
