const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const { env } = require('../config/env')
const { User } = require('../models')
const { AppError } = require('../utils/errors')

const signupSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(72),
})

const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(72),
})

function signToken(userId) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN,
  })
}

async function signup(req, res, next) {
  try {
    const { email, password } = signupSchema.parse(req.body)

    const existing = await User.findOne({ where: { email } })
    if (existing) throw new AppError('Email already in use', 409)

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, passwordHash })

    const token = signToken(user.id)
    return res.status(201).json({ token, user: { id: user.id, email: user.email } })
  } catch (err) {
    return next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await User.findOne({ where: { email } })
    if (!user) throw new AppError('Invalid credentials', 401)

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new AppError('Invalid credentials', 401)

    const token = signToken(user.id)
    return res.json({ token, user: { id: user.id, email: user.email } })
  } catch (err) {
    return next(err)
  }
}

async function me(req, res, next) {
  try {
    return res.json({ user: { id: req.user.id, email: req.user.email } })
  } catch (err) {
    return next(err)
  }
}

module.exports = { signup, login, me }

