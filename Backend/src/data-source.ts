import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'E_commerce',
  entities: [join(__dirname, './entities/*.{ts,js}')], // Support both .ts and .js
  migrations: [join(__dirname, './migrations/*.{ts,js}')], // Support both .ts and .js
  synchronize: false,
});