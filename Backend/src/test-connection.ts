import { AppDataSource } from './data-source';

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection is successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });