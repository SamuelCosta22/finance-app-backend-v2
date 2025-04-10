import cors from 'cors';
import 'dotenv/config.js';
import express from 'express';
import { makeCreateUserController } from './factories/controllers/users/make-create-user.controller.ts';
import { makeDeleteUserController } from './factories/controllers/users/make-delete-user.controller.ts';
import { makeGetUserByIdController } from './factories/controllers/users/make-get-user-by-id.controller.ts';
import { makeUpdateUserController } from './factories/controllers/users/make-update-user.controller.ts';
import { makeCreateTransactionController } from './factories/controllers/transactions/make-create-transaction.controller.ts';
import { makeGetTransactionsByUserIdController } from './factories/controllers/transactions/make-get-transactions-by-user-id.controller.ts';
import { makeUpdateTransactionController } from './factories/controllers/transactions/make-update-transaction.controller.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdController = makeGetUserByIdController();
  const { body, statusCode } = await getUserByIdController.execute(request);
  response.status(statusCode).send(body);
});

app.post('/api/users', async (request, response) => {
  const createUserController = makeCreateUserController();
  const { body, statusCode } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

app.patch('/api/users/:userId', async (request, response) => {
  const updateUserController = makeUpdateUserController();
  const { body, statusCode } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

app.delete('/api/users/:userId', async (request, response) => {
  const deleteUserController = makeDeleteUserController();
  const { body, statusCode } = await deleteUserController.execute(request);
  response.status(statusCode).send(body);
});

app.get('/api/transactions', async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionsByUserIdController();
  const { body, statusCode } =
    await getTransactionsByUserIdController.execute(request);
  response.status(statusCode).send(body);
});

app.post('/api/transactions', async (request, response) => {
  const createTransactionController = makeCreateTransactionController();
  const { body, statusCode } =
    await createTransactionController.execute(request);
  response.status(statusCode).send(body);
});

app.patch('/api/transactions/:transactionId', async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController();
  const { body, statusCode } =
    await updateTransactionController.execute(request);
  response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log('listening on port:', process.env.PORT),
);
