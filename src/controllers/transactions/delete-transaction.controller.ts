import { IDeleteTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { serverError, success } from '../helpers/http.ts';
import { invalidIdResponse } from '../helpers/invalid-response.ts';
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
      console.error(error);
      return serverError();
    }
  }
}
