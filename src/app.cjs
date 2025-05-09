const cors = require('cors');
const express = require('express');
const userRouter = require('./routes/user.ts').userRouter;
const transactionRouter = require('./routes/transaction.ts').transactionRouter;
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf8'),
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = { app };
