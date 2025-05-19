import { Router } from 'express';

import { makeCreateTransactionController } from '../factories/controllers/transactions/make-create-transaction.controller.ts';
import { makeDeleteTransactionController } from '../factories/controllers/transactions/make-delete-transaction.controller.ts';
import { makeGetTransactionsByUserIdController } from '../factories/controllers/transactions/make-get-transactions-by-user-id.controller.ts';
import { makeUpdateTransactionController } from '../factories/controllers/transactions/make-update-transaction.controller.ts';
import { auth } from '../middlewares/auth.ts';

export const transactionRouter = Router();

transactionRouter.get('/me', auth, async (request: any, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionsByUserIdController();
  const { body, statusCode } = await getTransactionsByUserIdController.execute({
    ...request,
    query: {
      ...request.query,
      from: request.query.from,
      to: request.query.to,
      userId: request.userId,
    },
  });
  response.status(statusCode).send(body);
});

transactionRouter.post('/me', auth, async (request: any, response) => {
  const createTransactionController = makeCreateTransactionController();
  const { body, statusCode } = await createTransactionController.execute({
    ...request,
    body: {
      ...request.body,
      user_id: request.userId,
    },
  });
  response.status(statusCode).send(body);
});

transactionRouter.patch(
  '/me/:transactionId',
  auth,
  async (request: any, response) => {
    const updateTransactionController = makeUpdateTransactionController();
    const { body, statusCode } = await updateTransactionController.execute({
      ...request,
      body: {
        ...request.body,
        user_id: request.userId,
      },
    });
    response.status(statusCode).send(body);
  },
);

transactionRouter.delete(
  '/me/:transactionId',
  auth,
  async (request: any, response) => {
    const deleteTransactionController = makeDeleteTransactionController();
    const { body, statusCode } = await deleteTransactionController.execute({
      params: {
        transactionId: request.params.transactionId,
        user_id: request.userId,
      },
    });
    response.status(statusCode).send(body);
  },
);
