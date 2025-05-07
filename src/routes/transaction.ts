import { Router } from 'express';

import { makeCreateTransactionController } from '../factories/controllers/transactions/make-create-transaction.controller.ts';
import { makeDeleteTransactionController } from '../factories/controllers/transactions/make-delete-transaction.controller.ts';
import { makeGetTransactionsByUserIdController } from '../factories/controllers/transactions/make-get-transactions-by-user-id.controller.ts';
import { makeUpdateTransactionController } from '../factories/controllers/transactions/make-update-transaction.controller.ts';

export const transactionRouter = Router();

transactionRouter.get('/', async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionsByUserIdController();
  const { body, statusCode } =
    await getTransactionsByUserIdController.execute(request);
  response.status(statusCode).send(body);
});

transactionRouter.post('/', async (request, response) => {
  const createTransactionController = makeCreateTransactionController();
  const { body, statusCode } =
    await createTransactionController.execute(request);
  response.status(statusCode).send(body);
});

transactionRouter.patch('/:transactionId', async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController();
  const { body, statusCode } =
    await updateTransactionController.execute(request);
  response.status(statusCode).send(body);
});

transactionRouter.delete('/:transactionId', async (request, response) => {
  const deleteTransactionController = makeDeleteTransactionController();
  const { body, statusCode } =
    await deleteTransactionController.execute(request);
  response.status(statusCode).send(body);
});
