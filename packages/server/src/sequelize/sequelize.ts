import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DB as string,
    process.env.POSTGRES_USER as string,
    process.env.POSTGRES_PASSWORD as string,
    {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT_INTERNAL) || 5433,
      dialect: 'postgres',
      logging: false,
      define: {
        timestamps: false,
      },
    }
);

try {
  await sequelize.authenticate();
  console.log('Подключение к базе данных успешно установлено.');
} catch (error) {
  console.error('Невозможно подключиться к базе данных:', error);
}

export default sequelize;
