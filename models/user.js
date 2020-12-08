const mongoose = require("mongoose");
const Joi = require("joi");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isLibrarian: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(100),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(255),
    isLibrarian: Joi.boolean(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
