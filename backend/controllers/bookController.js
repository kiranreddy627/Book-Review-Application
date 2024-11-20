const Book = require("../models/bookModel");
const mongoose = require("mongoose");

// Add a new book
const addBook = async (req, res) => {
  try {
    const user = req.params.user; // Get user from URL params
    const { title, author, ISBN, genre, coverImage } = req.body;

    // Ensure user is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const book = await Book.create({ title, author, ISBN, genre, coverImage, user });
    res.status(201).json({ book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("user");
    res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a book
const editBook = async (req, res) => {
  try {
    const { title, author, ISBN, genre, coverImage } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, ISBN, genre, coverImage },
      { new: true }
    );
    res.status(200).json({ book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get books by user
const getBooksByUser = async (req, res) => {
  try {
    const user = req.params.id;
    const books = await Book.find({ user }).populate("user");
    res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search books by title, author, or ISBN
const searchBooks = async (req, res) => {
  const { query } = req.query; // Extract the search query from the request
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // Search for books that match the query in title, author, or ISBN
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { ISBN: { $regex: query, $options: "i" } },
      ],
    });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found matching the query" });
    }

    res.status(200).json(books);
  } catch (err) {
    console.error("Error searching books:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add or update user rating
const updateRating = async (req, res) => {
    try {
      const { rating, userId } = req.body; // Extract rating and userId from request body
      const bookId = req.params.id;
  
      // Validate book ID
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
  
      // Fetch the book by ID
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      console.log("Updating rating for book:", bookId);
  
      // Check if the user has already rated this book
      const existingRating = book.ratings.find((r) => r.user.toString() === userId);
  
      if (existingRating) {
        // Update the existing rating
        existingRating.rating = rating;
        console.log(`Updated existing rating for user ${userId}`);
      } else {
        // Add a new rating entry
        book.ratings.push({ user: userId, rating });
        console.log(`Added new rating for user ${userId}`);
      }
  
      // Recalculate the average rating
      const totalRatings = book.ratings.length;
      const averageRating = book.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
  
      // Update the average rating
      book.averageRating = averageRating;
  
      // Save the book document
      await book.save();
  
      console.log("Rating updated successfully. New average rating:", averageRating);
  
      // Respond with the updated average rating
      res.status(200).json({ averageRating });
    } catch (error) {
      console.error("Error updating rating:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
module.exports = {
  addBook,
  getBooks,
  editBook,
  deleteBook,
  getBooksByUser,
  searchBooks,
  updateRating,
};
