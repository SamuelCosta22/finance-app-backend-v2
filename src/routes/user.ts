import { Router } from 'express';

import 'dotenv/config.js';
import { makeCreateUserController } from '../factories/controllers/users/make-create-user.controller.ts';
import { makeDeleteUserController } from '../factories/controllers/users/make-delete-user.controller.ts';
import { makeGetUserBalanceController } from '../factories/controllers/users/make-get-user-balance.controller.ts';
import { makeGetUserByIdController } from '../factories/controllers/users/make-get-user-by-id.controller.ts';
import { makeUpdateUserController } from '../factories/controllers/users/make-update-user.controller.ts';
import { makeLoginUserController } from '../factories/controllers/users/make-login-user.controller.ts';

export const userRouter = Router();

userRouter.get('/:userId', async (request, response) => {
  const getUserByIdController = makeGetUserByIdController();
  const { body, statusCode } = await getUserByIdController.execute(request);
  response.status(statusCode).send(body);
});

userRouter.post('/', async (request, response) => {
  const createUserController = makeCreateUserController();
  const { body, statusCode } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

userRouter.patch('/:userId', async (request, response) => {
  const updateUserController = makeUpdateUserController();
  const { body, statusCode } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

userRouter.delete('/:userId', async (request, response) => {
  const deleteUserController = makeDeleteUserController();
  const { body, statusCode } = await deleteUserController.execute(request);
  response.status(statusCode).send(body);
});

userRouter.get('/:userId/balance', async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController();
  const { body, statusCode } = await getUserBalanceController.execute(request);
  response.status(statusCode).send(body);
});

userRouter.post('/login', async (request, response) => {
  const loginUserController = makeLoginUserController();
  const { body, statusCode } = await loginUserController.execute(request);
  response.status(statusCode).send(body);
});
