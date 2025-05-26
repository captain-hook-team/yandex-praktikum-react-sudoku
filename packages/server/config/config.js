// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

const config = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT_CONNECTION) || 5433,
  dialect: 'postgres',
};

module.exports = {
  development: config,
  production: config,
  test: config,
};
