import { ICreateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import {
  CreateTransactionsParams,
  TransactionEnum,
} from '../../types/transactions/CreateTransactionParams.ts';
import { badRequest, created, serverError } from '../users/helpers/http.ts';
import { invalidIdResponse } from '../users/helpers/invalid-response.ts';
import {
  checkIfIdIsValid,
  validateRequiredFields,
} from '../users/helpers/validations.ts';
import validator from 'validator';

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

      if (params.amount <= 0) {
        return badRequest({
          message: 'The amount must be greater than 0.',
        });
      }

      const amountString = params.amount.toFixed(2);

      const amountIsValid = validator.isCurrency(amountString, {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      });

      if (!amountIsValid) {
        return badRequest({
          message: 'The amount must be a valid currency.',
        });
      }

      const type = params.type.trim().toUpperCase() as TransactionEnum;
      const typeIsValid = Object.values(TransactionEnum).includes(type);
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
