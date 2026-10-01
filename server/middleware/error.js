function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let status = 500;
  let message = 'Something went wrong. Please try again.';

  if (error && error.code === 11000) {
    status = 409;
    message = 'That email or record already exists.';
  } else if (error.name === 'ValidationError') {
    status = 400;
    message = Object.values(error.errors || {}).map(entry => entry.message).join(' ') || 'Invalid data provided.';
  } else if (error.name === 'CastError') {
    status = 400;
    message = 'Invalid id provided.';
  } else if (error.status) {
    status = error.status;
    message = error.message;
  }

  console.error(error);
  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };