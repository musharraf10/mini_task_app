const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { env } = require('../config/env')
const { User } = require('../models')
const { AppError } = require('../utils/errors')

function signToken(userId) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN,
  })
}

async function signup(req, res) {
  const { email, password } = req.validated.body

  const existing = await User.findOne({ where: { email } })
  if (existing) throw new AppError('Email already in use', 409)

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ email, passwordHash })

  const token = signToken(user.id)
  return res.status(201).json({ token, user: { id: user.id, email: user.email } })
}

async function login(req, res) {
  const { email, password } = req.validated.body

  const user = await User.findOne({ where: { email } })
  if (!user) throw new AppError('Invalid credentials', 401)

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw new AppError('Invalid credentials', 401)

  const token = signToken(user.id)
  return res.json({ token, user: { id: user.id, email: user.email } })
}

async function me(req, res) {
  return res.json({ user: { id: req.user.id, email: req.user.email } })
}

module.exports = { signup, login, me }

