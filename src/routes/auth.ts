import { Router } from 'express';
import { makeLoginUserController } from '../factories/controllers/users/make-login-user.controller.ts';
import { makeRefreshTokenController } from '../factories/controllers/users/make-refresh-token.controller.ts';

export const authRouter = Router();

authRouter.post('/login', async (request, response) => {
  const loginUserController = makeLoginUserController();
  const { body, statusCode } = await loginUserController.execute(request);
  response.status(statusCode).send(body);
});

authRouter.post('/refresh-token', async (request, response) => {
  const refreshTokenController = makeRefreshTokenController();
  const { body, statusCode } = await refreshTokenController.execute(request);
  response.status(statusCode).send(body);
});
