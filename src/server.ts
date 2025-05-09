import 'dotenv/config.js';
import { app } from './app.cjs';

app.listen(process.env.PORT, () =>
  console.log('listening on port:', process.env.PORT),
);
