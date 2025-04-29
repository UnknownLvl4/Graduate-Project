"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection is successful!');
    process.exit(0);
})
    .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
});
//# sourceMappingURL=test-connection.js.map