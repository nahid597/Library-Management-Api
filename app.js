var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var cors = require("cors");
const config = require("config");

const indexRouter = require("./routes/index");
const studenRouter = require("./routes/student");
const librarianRouter = require("./routes/librarian");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

if (!config.get("jwtprivatekey")) {
  console.log("FATAL error.. private key not set");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/library", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("mongode connected successfully"))
  .catch((error) => console.log(error));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/student", studenRouter);
app.use("/api/librarian", librarianRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
