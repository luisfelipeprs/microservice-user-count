"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
exports.env = {
    MYSQL_HOST: process.env.DB_HOST || 'localhost',
    MYSQL_PORT: +(process.env.DB_PORT || 3306),
    MYSQL_USER: process.env.DB_USER || 'root',
    MYSQL_PASSWORD: process.env.DB_PASSWORD || 'root',
    MYSQL_DATABASE: process.env.DB_DATABASE || 'app_db',
};
