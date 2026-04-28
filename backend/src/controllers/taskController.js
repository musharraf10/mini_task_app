const { Task } = require('../models')
const { AppError } = require('../utils/errors')

async function listTasks(req, res) {
  const tasks = await Task.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  })
  return res.json({ tasks })
}

async function createTask(req, res) {
  const { title, description } = req.validated.body
  const task = await Task.create({ userId: req.user.id, title, description: description ?? null })
  return res.status(201).json({ task })
}

async function updateTask(req, res) {
  const { id } = req.validated.params
  const patch = req.validated.body

  const task = await Task.findOne({ where: { id, userId: req.user.id } })
  if (!task) throw new AppError('Task not found', 404)

  await task.update(patch)
  return res.json({ task })
}

async function deleteTask(req, res) {
  const { id } = req.validated.params
  const deleted = await Task.destroy({ where: { id, userId: req.user.id } })
  if (!deleted) throw new AppError('Task not found', 404)
  return res.status(204).send()
}

module.exports = { listTasks, createTask, updateTask, deleteTask }

