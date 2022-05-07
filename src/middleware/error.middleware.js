function errorMiddleware(error, req, res, next) { // eslint-disable-line no-unused-vars
  if (error && error.message === 'validation error') {
    res.status(400).json(error.errors);
  } else {
    const status = error.status || 500;
    const response = error.message || { error: true, message: 'Something went wrong' };
    res.status(status).send(response);
  }
}

module.exports = errorMiddleware;
