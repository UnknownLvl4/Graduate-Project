"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const child_process_1 = require("child_process");
const migrationName = process.argv[2];
if (!migrationName) {
    console.error('Please provide a migration name.');
    process.exit(1);
}
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
    console.log(data_source_1.AppDataSource.options);
    const command = `npx typeorm migration:generate ./src/migrations/${migrationName} -d ./src/data-source.ts`;
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
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
//# sourceMappingURL=migration-generate.js.map