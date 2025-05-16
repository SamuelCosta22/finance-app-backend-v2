import { ZodError } from 'zod';
import { UserNotFoundError } from '../../errors/user.ts';
import { getTransactionsByUserIdSchema } from '../../schemas/transaction.ts';
import { GetTransactionsByUserIdUseCase } from '../../usecases/transactions/get-transactions-by-user-id.usecase.ts';
import { badRequest, serverError, success } from '../helpers/http.ts';
import { userNotFoundResponse } from '../helpers/invalid-response.ts';

export class GetTransactionsByUserIdController {
  constructor(
    private getTransactionsByUserIdUseCase: GetTransactionsByUserIdUseCase,
  ) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.query.userId;
      const from = httpRequest.query.from;
      const to = httpRequest.query.to;

      await getTransactionsByUserIdSchema.parseAsync({
        user_id: userId,
        from,
        to,
      });

      const transactions =
        await this.getTransactionsByUserIdUseCase.execute(userId);

      const { statusCode, body } = success(transactions);
      return { statusCode, body };
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }
      console.error(error);
      return serverError();
    }
  }
}
