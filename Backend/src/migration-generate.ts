import { AppDataSource } from './data-source';
import { exec } from 'child_process';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name.');
  process.exit(1);
}

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    console.log(AppDataSource.options);
    const command = `npx typeorm migration:generate ./src/migrations/${migrationName} -d ./src/data-source.ts`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });