const { sequelize } = require('../config/sequelize')
const { initUser, User } = require('./User')
const { initTask, Task } = require('./Task')

initUser(sequelize)
initTask(sequelize)

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' })
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = { sequelize, User, Task }

