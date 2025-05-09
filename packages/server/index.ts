import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { createClientAndConnect } from './db';

dotenv.config();

console.log('');

const app = express();
app.use(cors());
const port = Number(process.env.SERVER_PORT) || 3001;

createClientAndConnect();

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
});
