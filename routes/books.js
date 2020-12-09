const express = require("express");
const _ = require("lodash");
var multer = require("multer");

const { Book, validate } = require("../models/book");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const { Mongoose } = require("mongoose");

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("something worng. file not upload"), false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", auth, async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).send("You are not registered");
  }

  Book.find()
    .then((result) => {
      res.status(200).json({
        book: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:id", auth, async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).send("You are not registered");
  }

  Book.findById(req.params.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", auth, upload.single("bookImage"), async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user || !user.isLibrarian) {
    return res.status(400).send("You are not a librarian");
  }

  if (req.file) {
    req.body.bookImage = req.file.path;
  }
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let book = new Book(
    _.pick(req.body, [
      "bookName",
      "author",
      "genre",
      "releaseDate",
      "bookImage",
      "isActive",
    ])
  );

  await book.save();

  res.status(200).send(book);
});

router.put("/:id", auth, async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user || !user.isLibrarian) {
    return res.status(400).send("You are not a librarian");
  }

  if (req.file) {
    req.body.bookImage = req.file.path;
  }

  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let book = new Book({
    _id: req.params.id,
    bookName: req.body.bookName,
    author: req.body.author,
    genre: req.body.genre,
    releaseDate: req.body.releaseDate,
    bookImage: req.body.bookImage,
    isActive: req.body.isActive,
  });

  Book.updateOne({ _id: req.params.id }, book)
    .then(() => {
      res.status(200).json({
        message: "update data successfully",
        book: book,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", auth, async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user || !user.isLibrarian) {
    return res.status(400).send("You are not a librarian");
  }

  Book.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).send("book deleted successfully");
    })
    .catch((err) => {
      res.status(404).send("given id is not vlaid");
    });
});

module.exports = router;
