const { env } = require('./config/env')
const { createApp } = require('./app')
const { sequelize } = require('./models')

async function start() {
  await sequelize.authenticate()

  // Note: migrations are preferred; sync is here as a safety net for local dev.
  if (env.NODE_ENV !== 'production') {
    await sequelize.sync()
  }

  const app = createApp()
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})

