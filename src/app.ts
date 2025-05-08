import cors from 'cors';
import 'dotenv/config.js';
import express from 'express';
import { transactionRouter } from './routes/transaction.ts';
import { userRouter } from './routes/user.ts';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

const swaggerDocument = JSON.parse(
  fs.readFileSync(
    path.join(import.meta.dirname, '../docs/swagger.json'),
    'utf8',
  ),
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
