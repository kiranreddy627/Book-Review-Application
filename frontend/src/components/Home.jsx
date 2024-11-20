import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')).name 
    : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Box>
      {/* Navbar with the username and logout functionality */}
      <Navbar username={username} onLogout={handleLogout} />

      <Container>
        {/* Introduction Section */}
        <Paper sx={{ padding: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Book Library!
          </Typography>
          <Typography variant="body1" paragraph>
            Our platform allows you to browse, manage, and personalize your collection of books. 
            Whether you're looking to explore new titles or manage your personal library, this is the place for you.
          </Typography>
          <Typography variant="body1" paragraph>
            Start by exploring our vast collection of books or adding your own to keep track of your reading journey.
          </Typography>
          <Typography variant="body1" paragraph>
            You can view details of any book, edit your personal library, and even remove books you no longer need. 
            Join the community and explore books that inspire and educate.
          </Typography>
        </Paper>

        {/* View All Books Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/all-books')}
          >
            View All Books
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
