const { Task } = require('../models')
const { AppError } = require('../utils/errors')
const { z } = require('zod')

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
})

const updateTaskBodySchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).nullable().optional(),
    status: z.enum(['pending', 'completed']).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: 'No fields to update' })

const taskIdParamSchema = z.object({
  id: z.string().uuid(),
})

async function listTasks(req, res, next) {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    })
    return res.json({ tasks })
  } catch (err) {
    return next(err)
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description } = createTaskSchema.parse(req.body)
    const task = await Task.create({
      userId: req.user.id,
      title,
      description: description ?? null,
    })
    return res.status(201).json({ task })
  } catch (err) {
    return next(err)
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = taskIdParamSchema.parse(req.params)
    const patch = updateTaskBodySchema.parse(req.body)

    const task = await Task.findOne({ where: { id, userId: req.user.id } })
    if (!task) throw new AppError('Task not found', 404)

    await task.update(patch)
    return res.json({ task })
  } catch (err) {
    return next(err)
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = taskIdParamSchema.parse(req.params)
    const deleted = await Task.destroy({ where: { id, userId: req.user.id } })
    if (!deleted) throw new AppError('Task not found', 404)
    return res.status(204).send()
  } catch (err) {
    return next(err)
  }
}

module.exports = { listTasks, createTask, updateTask, deleteTask }

