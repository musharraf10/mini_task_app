const express = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const { listTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController')

const router = express.Router()

router.use(requireAuth)
router.get('/', listTasks)
router.post('/', createTask)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)

module.exports = { taskRoutes: router }

