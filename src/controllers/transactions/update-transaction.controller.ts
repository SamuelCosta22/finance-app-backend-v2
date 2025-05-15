import { ZodError } from 'zod';
import { updateTransactionSchema } from '../../schemas/transaction.ts';
import { IUpdateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import {
  badRequest,
  forbidden,
  serverError,
  success,
} from '../helpers/http.ts';
import { invalidIdResponse } from '../helpers/invalid-response.ts';
import { checkIfIdIsValid } from '../helpers/validations.ts';
import { TransactionNotFoundError } from '../../errors/transaction.ts';
import { transactionNotFoundResponse } from '../helpers/transactions-validators.ts';
import { ForbiddenError } from '../../errors/user.ts';

export class UpdateTransactionController {
  constructor(private updateTransactionUseCase: IUpdateTransactionRepository) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId);

      if (!idIsValid) return invalidIdResponse();

      const params = httpRequest.body;

      await updateTransactionSchema.parseAsync(params);

      const updatedTransaction = await this.updateTransactionUseCase.execute(
        httpRequest.params.transactionId,
        params,
      );

      const { statusCode, body } = success(updatedTransaction);
      return { statusCode, body };
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }
      if (error instanceof TransactionNotFoundError)
        return transactionNotFoundResponse();
      if (error instanceof ForbiddenError) return forbidden();
      console.error(error);
      return serverError();
    }
  }
}
