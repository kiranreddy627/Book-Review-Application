import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ username, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* App title and logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
        <Button component={Link} to="/home" color="inherit" sx={{ marginRight: 2 }}>
            Book Management System
          </Button>
        </Typography>

        {/* Navigation links for all users */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button component={Link} to="/all-books" color="inherit" sx={{ marginRight: 2 }}>
            All Books
          </Button>
          <Button component={Link} to="/my-books" color="inherit" sx={{ marginRight: 2 }}>
            My Books
          </Button>

          {/* If user is logged in, show the username and logout options */}
          {username ? (
            <>
              <Button
                onClick={handleMenuClick}
                color="inherit"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: 2,
                  textTransform: 'capitalize',
                }}
              >
                <Avatar sx={{ width: 30, height: 30, marginRight: 1 }} />
                {username}
              </Button>
              {/* Menu for Username and Logout */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            // If not logged in, show login and signup buttons
            <Box>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/signup" color="inherit" sx={{ marginLeft: 2 }}>
                Signup
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
