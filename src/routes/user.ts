import { Router } from 'express';

import 'dotenv/config.js';
import { makeCreateUserController } from '../factories/controllers/users/make-create-user.controller.ts';
import { makeDeleteUserController } from '../factories/controllers/users/make-delete-user.controller.ts';
import { makeGetUserBalanceController } from '../factories/controllers/users/make-get-user-balance.controller.ts';
import { makeGetUserByIdController } from '../factories/controllers/users/make-get-user-by-id.controller.ts';
import { makeUpdateUserController } from '../factories/controllers/users/make-update-user.controller.ts';
import { auth } from '../middlewares/auth.ts';

export const userRouter = Router();

userRouter.get('/me', auth, async (request: any, response) => {
  const getUserByIdController = makeGetUserByIdController();
  const { body, statusCode } = await getUserByIdController.execute({
    ...request,
    params: { userId: request.userId },
  });
  response.status(statusCode).send(body);
});

userRouter.post('/', async (request, response) => {
  const createUserController = makeCreateUserController();
  const { body, statusCode } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

userRouter.patch('/me', auth, async (request: any, response) => {
  const updateUserController = makeUpdateUserController();
  const { body, statusCode } = await updateUserController.execute({
    ...request,
    params: { userId: request.userId },
  });
  response.status(statusCode).send(body);
});

userRouter.delete('/me', auth, async (request: any, response) => {
  const deleteUserController = makeDeleteUserController();
  const { body, statusCode } = await deleteUserController.execute({
    ...request,
    params: { userId: request.userId },
  });
  response.status(statusCode).send(body);
});

userRouter.get('/me/balance', auth, async (request: any, response) => {
  const getUserBalanceController = makeGetUserBalanceController();
  const { body, statusCode } = await getUserBalanceController.execute({
    ...request,
    params: {
      userId: request.userId,
    },
    query: {
      from: request.query.from,
      to: request.query.to,
    },
  });
  response.status(statusCode).send(body);
});
