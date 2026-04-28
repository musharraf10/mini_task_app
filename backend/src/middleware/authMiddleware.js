const jwt = require('jsonwebtoken')
const { env } = require('../config/env')
const { User } = require('../models')
const { AppError } = require('../utils/errors')

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')

  if (!token) return next(new AppError('Missing Authorization token', 401))

  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    const user = await User.findByPk(payload.sub, { attributes: ['id', 'email'] })
    if (!user) return next(new AppError('Invalid token', 401))
    req.user = user
    return next()
  } catch {
    return next(new AppError('Invalid token', 401))
  }
}

module.exports = { requireAuth }

