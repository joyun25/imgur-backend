const handleResponse = {
  success: (res, message, data) => {
    res.send({
      "status": "success",
      "message": message,
      "data": data
    });
  },
  errorAsync: (func) => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
  },
  errorNew: (httpStatus, message, next) => {
    const error = new Error(message);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
  },
  errorProd: (error, res) => {
    if (error.isOperational) {
      res.status(error.statusCode).send({
        "message": error.message
      })
    }else{
      console.error("出現重大錯誤", error);
      res.status(500).send({
        "status": "error",
        "message": "系統錯誤，請洽系統管理員"
      });
    }
  },
  errorDev: (error, res) => {
    res.status(error.statusCode).send({
      "message": error.message,
      "error": error,
      "stack": error.stack
    });
  }
};

module.exports = handleResponse;