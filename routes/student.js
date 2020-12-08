const express = require("express");
const { User } = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

/* GET users listing. */
router.get("/", auth, (req, res, next) => {
  res.send("request for a book");
});

module.exports = router;
