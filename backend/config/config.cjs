require('dotenv').config()

function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

const ssl =
  process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true'
    ? { require: true, rejectUnauthorized: false }
    : undefined

const baseFromUrl = process.env.DATABASE_URL
  ? {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      logging: false,
      dialectOptions: ssl ? { ssl } : {},
    }
  : null

const base = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'mini_saas_tasks',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: false,
  dialectOptions: ssl ? { ssl } : {},
}

module.exports = {
  development: baseFromUrl || base,
  test: {
    ...(baseFromUrl || base),
    ...(baseFromUrl ? {} : { database: process.env.DB_NAME_TEST || `${base.database}_test` }),
  },
  production: {
    ...(process.env.DATABASE_URL
      ? {
          use_env_variable: 'DATABASE_URL',
          dialect: 'postgres',
          logging: false,
          dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
        }
      : {
          ...base,
          database: requireEnv('DB_NAME'),
          username: requireEnv('DB_USER'),
          password: requireEnv('DB_PASSWORD'),
        }),
  },
}

