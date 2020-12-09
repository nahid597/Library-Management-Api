const mongoose = require("mongoose");
const Joi = require("joi");
const { string } = require("joi");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  bookName: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  bookImage: {
    type: String,
    required: true
  },
  isActive: {
      type: Boolean,
      default: false
  }
});

const Book = mongoose.model("Book", BookSchema);

function validateBook(book) {
  const schema = Joi.object({
    bookName: Joi.string().required(),
    author: Joi.string().required().min(5).max(255),
    genre: Joi.string().required(),
    releaseDate: Joi.string().required(),
    bookImage: Joi.string().required(),
    isActive: Joi.boolean()
  });

  return schema.validate(book);
}

exports.Book = Book;
exports.validate = validateBook;
