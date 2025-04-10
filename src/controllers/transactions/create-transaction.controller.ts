import { ICreateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import {
  CreateTransactionsParams,
  TransactionEnum,
} from '../../types/transactions/CreateTransactionParams.ts';
import { badRequest, created, serverError } from '../helpers/http.ts';
import { invalidIdResponse } from '../helpers/invalid-response.ts';
import {
  checkIfAmountIsValid,
  checkIfTypeIsValid,
} from '../helpers/transactions-validators.ts';
import {
  checkIfIdIsValid,
  validateRequiredFields,
} from '../helpers/validations.ts';

export type HttpRequest = {
  body: CreateTransactionsParams;
};

export class CreateTransactionController {
  constructor(private createTransactionUseCase: ICreateTransactionRepository) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      const requiredFields = ['user_id', 'date', 'name', 'amount', 'type'];

      const requiredFieldsValidation = validateRequiredFields(
        params,
        requiredFields,
      );

      if (!requiredFieldsValidation.success) {
        return badRequest({
          message: `The field ${requiredFieldsValidation.missingField} is required.`,
        });
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id);
      if (!userIdIsValid) {
        return invalidIdResponse();
      }

      const amountIsValid = checkIfAmountIsValid(params.amount);

      if (!amountIsValid) {
        return badRequest({
          message: 'The amount must be a valid currency.',
        });
      }

      const type = params.type.trim().toUpperCase() as TransactionEnum;
      const typeIsValid = checkIfTypeIsValid(type);

      if (!typeIsValid) {
        return badRequest({
          message: 'The type must be EARNING, EXPENSE or INVESTMENT.',
        });
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      });

      return created(transaction);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
