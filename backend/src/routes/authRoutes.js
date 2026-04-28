const express = require('express')
const { asyncHandler } = require('../middleware/asyncHandler')
const { validate } = require('../middleware/validate')
const { signupSchema, loginSchema } = require('../validators/authValidators')
const { signup, login, me } = require('../controllers/authController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/signup', validate(signupSchema), asyncHandler(signup))
router.post('/login', validate(loginSchema), asyncHandler(login))
router.get('/me', requireAuth, asyncHandler(me))

module.exports = { authRoutes: router }

