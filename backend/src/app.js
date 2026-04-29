const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')
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
    const distPath = path.resolve(__dirname, '../../frontend/dist')
    const indexPath = path.resolve(distPath, 'index.html')

    app.use(express.static(distPath))

    // Express 5 / path-to-regexp no longer accepts '*' route directly.
    // Use a regex fallback and skip API paths.
    app.get(/^(?!\/api\/).*/, (req, res, next) => {
      if (!fs.existsSync(indexPath)) {
        return next()
      }
      return res.sendFile(indexPath)
    })
  }

  app.use(errorMiddleware)

  return app
}

module.exports = { createApp }
