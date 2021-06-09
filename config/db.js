const Sequelize = require('sequelize');
// extraer valores de variables env
require('dotenv').config({path: 'variables.env'})
const db = new Sequelize(process.env.Bd_NOMBRE, process.env.DB_USER,process.env.BD_PASS, 
{
    host: process.env.BD_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;