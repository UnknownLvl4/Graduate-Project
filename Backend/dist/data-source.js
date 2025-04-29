"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const path_1 = require("path");
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'E_commerce',
    entities: [(0, path_1.join)(__dirname, './entities/*.{ts,js}')],
    migrations: [(0, path_1.join)(__dirname, './migrations/*.{ts,js}')],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map