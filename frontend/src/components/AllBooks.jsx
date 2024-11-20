import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Rating,
  TextField,
} from '@mui/material';
import Navbar from './Navbar'; // Import the Navbar component
import ApiService from './ApiService';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const service = new ApiService();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await service.get('/books/getall', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setBooks(response.data.books);
        setFilteredBooks(response.data.books); // Initialize filteredBooks with all books
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkUserAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = JSON.parse(localStorage.getItem('user'));
        setUsername(user.name);
        setUserId(user._id);
      }
    };

    fetchBooks();
    checkUserAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsername(null);
  };

  const handleRatingChange = async (bookId, newRating) => {
    try {
      const response = await service.put(
        `/books/rate/${bookId}`,
        {
          rating: newRating,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update the book's state immediately to reflect the changes
      setBooks((prevBooks) =>
        prevBooks.map((book) => {
          if (book._id === bookId) {
            const updatedRatings = [
              ...book.ratings.filter((r) => r.user !== userId),
              { user: userId, rating: newRating },
            ];

            return {
              ...book,
              ratings: updatedRatings,
              averageRating: response.data.averageRating, // Assuming backend sends updated averageRating
            };
          }
          return book;
        })
      );

      // Also update the filteredBooks array if search is active
      setFilteredBooks((prevFilteredBooks) =>
        prevFilteredBooks.map((book) => {
          if (book._id === bookId) {
            const updatedRatings = [
              ...book.ratings.filter((r) => r.user !== userId),
              { user: userId, rating: newRating },
            ];

            return {
              ...book,
              ratings: updatedRatings,
              averageRating: response.data.averageRating,
            };
          }
          return book;
        })
      );
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();

    // Filter books based on title, author, genre, or ISBN
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowercasedQuery) ||
        book.author.toLowerCase().includes(lowercasedQuery) ||
        book.genre.toLowerCase().includes(lowercasedQuery) ||
        book.ISBN.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredBooks(filtered);
  };

  return (
    <Box>
      {/* Navbar with the username and logout functionality */}
      <Navbar username={username} onLogout={handleLogout} />

      <Container>
        <Typography variant="h4" gutterBottom sx={{ mt: 3, textAlign: 'center' }}>
          All Books
        </Typography>

        {/* Search Bar */}
        <Box sx={{ my: 3, textAlign: 'center' }}>
          <TextField
            label="Search Books"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by title, author, genre, or ISBN"
          />
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            filteredBooks.map((book) => {
              // Check if the user has already rated this book
              const userRating =
                book.ratings?.find((r) => r.user === userId)?.rating || 0;

              return (
                <Grid item xs={12} md={10} key={book._id}>
                  <Card
                    sx={{
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      padding: 3,
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h4" gutterBottom>
                        {book.title}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        <strong>Author:</strong> {book.author}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        <strong>Genre:</strong> {book.genre}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        <strong>ISBN:</strong> {book.ISBN}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        <strong>Published By:</strong> {book.user?.name || 'Unknown'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>
                          Average Rating:
                        </Typography>
                        <Rating
                          name={`average-rating-${book._id}`}
                          value={book.averageRating || 0}
                          precision={0.1}
                          readOnly
                        />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {book.averageRating
                            ? `${book.averageRating.toFixed(1)} / 5`
                            : 'No Ratings'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>
                          Your Rating:
                        </Typography>
                        <Rating
                          name={`user-rating-${book._id}`}
                          value={userRating}
                          precision={1}
                          onChange={(event, newValue) =>
                            handleRatingChange(book._id, newValue)
                          }
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default AllBooks;
