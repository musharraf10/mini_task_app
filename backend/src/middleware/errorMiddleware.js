const { ZodError } = require('zod')

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) return next(err)

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    })
  }

  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500

  return res.status(statusCode).json({
    error: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
    message: statusCode >= 500 ? 'Something went wrong' : err.message,
  })
}

module.exports = { errorMiddleware }

