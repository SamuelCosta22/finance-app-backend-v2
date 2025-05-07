import { TransactionNotFoundError } from '../../errors/transaction.ts';
import { IDeleteTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { serverError, success } from '../helpers/http.ts';
import { invalidIdResponse } from '../helpers/invalid-response.ts';
import { transactionNotFoundResponse } from '../helpers/transactions-validators.ts';
import { checkIfIdIsValid } from '../helpers/validations.ts';

export class DeleteTransactionController {
  constructor(private deleteTransactionUseCase: IDeleteTransactionRepository) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const idIsValid = checkIfIdIsValid(transactionId);
      if (!idIsValid) return invalidIdResponse();

      const deletedTransaction =
        await this.deleteTransactionUseCase.execute(transactionId);

      const { statusCode, body } = success(deletedTransaction);
      return { statusCode, body };
    } catch (error) {
      if (error instanceof TransactionNotFoundError)
        return transactionNotFoundResponse();
      console.error(error);
      return serverError();
    }
  }
}
