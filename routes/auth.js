const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const { User } = require("../models/user");

var router = express.Router();

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  const validPassword = bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }

  const token = await jwt.sign({ _id: user._id }, config.get("jwtprivatekey"));

  res.status(200).send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(255),
  });

  return schema.validate(req);
}

module.exports = router;
