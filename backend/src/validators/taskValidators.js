const { z } = require('zod')

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(5000).optional(),
  }),
})

const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      title: z.string().min(1).max(200).optional(),
      description: z.string().max(5000).nullable().optional(),
      status: z.enum(['pending', 'completed']).optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, { message: 'No fields to update' }),
})

const taskIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
})

module.exports = { createTaskSchema, updateTaskSchema, taskIdSchema }

