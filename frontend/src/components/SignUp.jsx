import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Blue for primary buttons
    },
    secondary: {
      main: '#f50057', // Pink for alerts or accents
    },
  },
});

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setLoading(false);
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setLoading(false);
      setError('Passwords do not match.');
      return;
    }

    try {
      console.log("before");
      const response = await axios.post('http://localhost:5000/auth/signup', { name, email, password });
      console.log("success");
      setLoading(false);

      if (response.data) {
        setSuccess('Signup successful! You can now log in.');
      } else {
        setError(response.data.message || 'Signup failed.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Signup
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                {success}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Signup'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={handleNavigateToLogin}
              >
                Already have an account? Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
