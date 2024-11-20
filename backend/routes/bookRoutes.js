const express = require("express");
const mongoose = require("mongoose");
const {
  addBook,
  getBooks,
  editBook,
  deleteBook,
  getBooksByUser,
  searchBooks,
  updateRating,
} = require("../controllers/bookController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Assuming you have authMiddleware

const router = express.Router();

// Routes
router.post("/add/:user", authMiddleware, addBook); // Add a new book (requires auth)
router.get("/getall", getBooks); // Get all books
router.put("/edit/:id", authMiddleware, editBook); // Edit a book (requires auth)
router.delete("/delete/:id", authMiddleware, deleteBook); // Delete a book (requires auth)
router.get("/getbyuser/:id", authMiddleware, getBooksByUser); // Get books by user (requires auth)
router.get("/search", searchBooks); // Search for books
router.put("/rate/:id", authMiddleware, updateRating); // Add or update a rating (requires auth)

module.exports = router;
