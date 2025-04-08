const { Sequelize } = require("sequelize")

const sequelize = new Sequelize('project-m-alumni', 'Faiz', 'Bismillah', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize