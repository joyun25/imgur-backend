const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const handleResponse = require('./service/handleResponse');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');

const app = express();

require("./connections");

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);

app.use(function(err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    return handleResponse.errorDev(err, res);
  }
  
  // production
  if (err.name === "ValidationError") {
    err.message = "資料欄位未填寫正確，請重新輸入"
    err.isOperational = true;
    return handleResponse.errorProd(err, res);
  }
  handleResponse.errorProd(err, res);
})
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", reason);
  // 記錄於 log 上
});
process.on('uncaughtException', reason => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(reason);
  console.error(reason.name); // ReferenceError
  console.error(reason.message); // thisCauseAnError is not defined
  console.error(reason.stack); // ReferenceError: thisCauseAnError is not defined ......
  process.exit(1);
});

module.exports = app;

