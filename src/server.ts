import cors from 'cors';
import 'dotenv/config.js';
import express from 'express';
import { CreateUserController } from './controllers/users/create-user.controller.ts';
import { DeleteUserController } from './controllers/users/delete-user.controller.ts';
import { GetUserByIdController } from './controllers/users/get-user-by-id.controller.ts';
import { UpdateUserController } from './controllers/users/update-user.controller.ts';
import { PostgresGetUserByIdRepository } from './repositories/postgres/users/get-user-by-id.repository.ts';
import { GetUserByIdUseCase } from './usecases/users/get-user-by-id.usecase.ts';
import { PostgresCreateUserRepository } from './repositories/postgres/users/create-user.repository.ts';
import { CreateUserUseCase } from './usecases/users/create-user.usecase.ts';
import { PostgresGetUserByEmailRepository } from './repositories/postgres/users/get-user-by-email.repository.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  const { body, statusCode } = await getUserByIdController.execute(request);
  response.status(statusCode).send(body);
});

app.post('/api/users', async (request, response) => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const createUserRepository = new PostgresCreateUserRepository();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
  );
  const createUserController = new CreateUserController(createUserUseCase);

  const { body, statusCode } = await createUserController.execute(request);
  response.status(statusCode).send(body);
});

app.patch('/api/users/:userId', async (request, response) => {
  const updateUserController = new UpdateUserController();
  const { body, statusCode } = await updateUserController.execute(request);
  response.status(statusCode).send(body);
});

app.delete('/api/users/:userId', async (request, response) => {
  const deleteUserController = new DeleteUserController();
  const { body, statusCode } = await deleteUserController.execute(request);
  response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
  console.log('listening on port:', process.env.PORT),
);
