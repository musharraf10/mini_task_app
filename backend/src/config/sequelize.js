const { Sequelize } = require('sequelize')
const { env } = require('./env')

const dialectOptions = {}
// Supabase requires SSL. In prod we always enable it; in dev you can force with DB_SSL=true.
if (env.NODE_ENV === 'production' || process.env.DB_SSL === 'true') {
  dialectOptions.ssl = { require: true, rejectUnauthorized: false }
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions,
    })
  : new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
      host: env.DB_HOST,
      port: env.DB_PORT,
      dialect: 'postgres',
      logging: false,
      dialectOptions,
    })

module.exports = { sequelize }
