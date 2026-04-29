const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const { env } = require('./config/env')
const { authRoutes } = require('./routes/authRoutes')
const { taskRoutes } = require('./routes/taskRoutes')
const { errorMiddleware } = require('./middleware/errorMiddleware')

function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
      credentials: false,
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan('dev'))

  app.get('/health', (req, res) => res.json({ ok: true }))

  app.use('/api/auth', authRoutes)
  app.use('/api/tasks', taskRoutes)

  if (env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '..', '..', 'frontend', 'dist')
    app.use(express.static(distPath))
    app.use((req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api/')) {
        return next()
      }

      return res.sendFile(path.join(distPath, 'index.html'))
    })
  }

  app.use(errorMiddleware)

  return app
}

module.exports = { createApp }
