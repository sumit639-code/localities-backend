class apierror extends Error {
  constructor(
    statuscode,
    message = "This message denotes the errors",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statuscode = statuscode;
    this.error = error;
    this.data = null;
    this.success = false;
    this.message = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { apierror };
