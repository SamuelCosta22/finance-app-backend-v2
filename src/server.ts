import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { CreateUserController } from './controllers/users/create-user.controller.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/users', async (request, response) => {
  const createUserController = new CreateUserController();
  const { body, statusCode } = await createUserController.execute(request);

  response.status(statusCode).json(body);
});

app.listen(process.env.PORT, () =>
  console.log('listening on port:', process.env.PORT),
);
