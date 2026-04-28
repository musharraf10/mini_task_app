const { z } = require('zod')

const signupSchema = z.object({
  body: z.object({
    email: z.string().email().max(320),
    password: z.string().min(8).max(72),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email().max(320),
    password: z.string().min(1).max(72),
  }),
})

module.exports = { signupSchema, loginSchema }

