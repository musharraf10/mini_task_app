const { DataTypes, Model } = require('sequelize')

class Task extends Model {}

function initTask(sequelize) {
  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
      indexes: [{ fields: ['userId'] }],
    },
  )

  return Task
}

module.exports = { Task, initTask }

