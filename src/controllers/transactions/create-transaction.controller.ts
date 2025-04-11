import { ZodError } from 'zod';
import { createTransactionSchema } from '../../schemas/transaction.ts';
import { ICreateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { CreateTransactionsParams } from '../../types/transactions/CreateTransactionParams.ts';
import { badRequest, created, serverError } from '../helpers/http.ts';

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

      await createTransactionSchema.parseAsync(params);

      const transaction = await this.createTransactionUseCase.execute(params);

      return created(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }
      console.error(error);
      return serverError();
    }
  }
}
