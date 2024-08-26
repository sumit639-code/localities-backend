import { apierror } from "../utils/apierror.js";

export const errorHandler = (err, req, res, next) => {
  console.error('Error caught by middleware:', err);

  res.setHeader('Content-Type', 'application/json'); // Set content type to JSON

  if (err instanceof apierror) {
    return res.status(err.statuscode || 500).json({
      success: false,
      message: err.message,
      error: err.error,
    });
  }

  return res.status(err.statuscode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
