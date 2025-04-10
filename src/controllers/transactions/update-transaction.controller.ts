import { IUpdateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { badRequest, serverError, success } from '../helpers/http.ts';
import { invalidIdResponse } from '../helpers/invalid-response.ts';
import {
  checkIfAmountIsValid,
  checkIfTypeIsValid,
} from '../helpers/transactions-validators.ts';
import { checkIfIdIsValid } from '../helpers/validations.ts';

export class UpdateTransactionController {
  constructor(private updateTransactionUseCase: IUpdateTransactionRepository) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId);

      if (!idIsValid) return invalidIdResponse();

      const params = httpRequest.body;

      const allowedFields = ['name', 'date', 'amount', 'type'];
      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      );

      if (someFieldIsNotAllowed) {
        return badRequest({ message: 'Some provided field is not allowed.' });
      }

      if (params.amount) {
        const amountIsValid = checkIfAmountIsValid(params.amount);
        if (!amountIsValid) {
          return badRequest({
            message: 'The amount must be a valid currency.',
          });
        }
      }

      if (params.type) {
        const typeIsValid = checkIfTypeIsValid(params.type);
        if (!typeIsValid) {
          return badRequest({
            message: 'The type must be EARNING, EXPENSE or INVESTMENT.',
          });
        }
      }

      const updatedTransaction = await this.updateTransactionUseCase.execute(
        httpRequest.params.transactionId,
        params,
      );

      const { statusCode, body } = success(updatedTransaction);
      return { statusCode, body };
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
