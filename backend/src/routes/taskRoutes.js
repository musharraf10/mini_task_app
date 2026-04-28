const express = require('express')
const { asyncHandler } = require('../middleware/asyncHandler')
const { requireAuth } = require('../middleware/authMiddleware')
const { validate } = require('../middleware/validate')
const { createTaskSchema, updateTaskSchema, taskIdSchema } = require('../validators/taskValidators')
const { listTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController')

const router = express.Router()

router.use(requireAuth)
router.get('/', asyncHandler(listTasks))
router.post('/', validate(createTaskSchema), asyncHandler(createTask))
router.patch('/:id', validate(updateTaskSchema), asyncHandler(updateTask))
router.delete('/:id', validate(taskIdSchema), asyncHandler(deleteTask))

module.exports = { taskRoutes: router }

