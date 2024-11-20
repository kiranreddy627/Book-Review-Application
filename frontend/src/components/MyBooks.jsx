import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Rating,
} from "@mui/material";
import Navbar from "./Navbar"; // Import the Navbar component
import ApiService from "./ApiService";

const MyBooks = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get user object from localStorage
  const userId = user?._id; // Extract user ID
  const username = user?.name || "Guest"; // Extract username or default to "Guest"

  const [books, setBooks] = useState([]); // Initialize books as an empty array
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    ISBN: "",
    genre: "",
    coverImage: "",
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const service = new ApiService();

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      console.log("Fetching books...");
      const response = await service.get(`/books/getbyuser/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Fetched books:", response.data);
      setBooks(response.data.books || []); // Extract the 'books' array from the response
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book = null) => {
    if (book) {
      setIsEditing(true);
      setEditingBookId(book._id);
      setBookData({
        title: book.title || "",
        author: book.author || "",
        ISBN: book.ISBN || "",
        genre: book.genre || "",
        coverImage: book.coverImage || "",
      });
    } else {
      setIsEditing(false);
      setBookData({
        title: "",
        author: "",
        ISBN: "",
        genre: "",
        coverImage: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setBookData({
      title: "",
      author: "",
      ISBN: "",
      genre: "",
      coverImage: "",
    });
  };

  const handleSaveBook = async () => {
    if (!bookData.title || !bookData.author || !bookData.ISBN || !bookData.genre) {
      alert("All fields are required!");
      return;
    }

    try {
      if (isEditing) {
        // Update existing book
        const response = await service.put(
          `/books/update/${editingBookId}`,
          bookData
        );
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book._id === editingBookId ? response.data.book : book))
        );
      } else {
        // Add a new book
        const response = await service.post(`/books/add/${userId}`, bookData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBooks((prevBooks) => [...prevBooks, response.data.book]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await service.delete(`/books/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    window.location.href = "/login"; // Redirect to login page or home page
  };

  return (
    <Box>
      <Navbar username={username} onLogout={handleLogout} /> {/* Pass props to Navbar */}
      <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h3" align="center" gutterBottom>
          My Books
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: "20px", display: "block", margin: "0 auto" }}
          onClick={() => handleOpenDialog()}
        >
          Add New Book
        </Button>
        {loading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : Array.isArray(books) && books.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
            }}
          >
            {books.map((book) => (
              <Card
                key={book._id}
                sx={{
                  width: "90%",
                  maxWidth: "800px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Author:</strong> {book.author}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Genre:</strong> {book.genre}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>ISBN:</strong> {book.ISBN}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      <strong>Rating:</strong>
                    </Typography>
                    <Rating name={`rating-${book._id}`} value={book.averageRating} readOnly />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button size="small" onClick={() => handleOpenDialog(book)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteBook(book._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" align="center">
            No books found. Add a new book to get started!
          </Typography>
        )}

        {/* Dialog for Add/Edit */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>{isEditing ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              value={bookData.title}
              onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Author"
              value={bookData.author}
              onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="ISBN"
              value={bookData.ISBN}
              onChange={(e) => setBookData({ ...bookData, ISBN: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Genre"
              value={bookData.genre}
              onChange={(e) => setBookData({ ...bookData, genre: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Cover Image URL"
              value={bookData.coverImage}
              onChange={(e) => setBookData({ ...bookData, coverImage: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSaveBook}>
              {isEditing ? "Save Changes" : "Add Book"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MyBooks;
