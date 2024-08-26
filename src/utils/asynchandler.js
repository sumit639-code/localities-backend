const asynchandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch((err) => {
        // Optional: Log the error for debugging
        console.error(err);

        // Optional: Handle specific types of errors
        if (err.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            message: 'Validation error occurred.',
            error: err.message,
          });
        }

        // Forward other errors to the default error handler
        next(err);
      });
  };
};

export { asynchandler };
