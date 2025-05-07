import cors from 'cors';
import 'dotenv/config.js';
import express from 'express';
import { transactionRouter } from './routes/transaction.ts';
import { userRouter } from './routes/user.ts';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);
