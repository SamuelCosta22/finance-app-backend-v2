import { UserNotFoundError } from '../../errors/user.ts';
import { GetTransactionsByUserIdUseCase } from '../../usecases/transactions/get-transactions-by-user-id.usecase.ts';
import { badRequest, serverError, success } from '../helpers/http.ts';
import {
  invalidIdResponse,
  userNotFoundResponse,
} from '../helpers/invalid-response.ts';
import { checkIfIdIsValid } from '../helpers/validations.ts';

export class GetTransactionsByUserIdController {
  constructor(
    private getTransactionsByUserIdUseCase: GetTransactionsByUserIdUseCase,
  ) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.query.userId;
      if (!userId) {
        return badRequest({ message: 'The field userId is required.' });
      }

      const userIdIsValid = checkIfIdIsValid(userId);
      if (!userIdIsValid) return invalidIdResponse();

      const transactions =
        await this.getTransactionsByUserIdUseCase.execute(userId);

      const { statusCode, body } = success(transactions);
      return { statusCode, body };
    } catch (error) {
      console.error(error);

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return serverError();
    }
  }
}
