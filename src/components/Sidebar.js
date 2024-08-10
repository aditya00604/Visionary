"use client";
import Link from 'next/link';
import { List, ListItemButton, ListItemText, Divider, Drawer, Typography, Box } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use useRouter to get the current route

const drawerWidth = 240;

const Sidebar = ({ open, handleDrawerToggle }) => {
  const { data: session } = useSession();
  const { pathname } = useRouter(); // Get the current route

  // Function to determine if the link is active
  const isActive = (path) => pathname === path;

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'white', // Set background color to white
          color: 'black',   // Set text color to black for contrast
        },
      }}
      variant="persistent"
      anchor="left"
      open
    >
      <Box sx={{ p: 2, bgcolor: 'blue', color: 'white' }}>
        <Typography variant="h6" noWrap>
        Visionary
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'gray' }} />
      <List>
        {!session ? (
          <>
             <ListItemButton
              component={Link}
              href="/"
              sx={{
                bgcolor: isActive('/') ? 'green' : 'transparent',
                '&:hover': { bgcolor: 'blue' },
              }}
            >
              <ListItemText primary="Gallery" sx={{ color: isActive('/') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/blog"
              sx={{
                bgcolor: isActive('/history') ? 'green' : 'transparent',
                '&:hover': { bgcolor: 'blue' },
              }}
            >
              <ListItemText primary="BlogPosts" sx={{ color: isActive('/history') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/login"
              sx={{
                bgcolor: isActive('/login') ? 'green' : 'transparent',
                '&:hover': { bgcolor: 'blue' },
              }}
            >
              <ListItemText primary="Login" sx={{ color: isActive('/login') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/signup"
              sx={{
                bgcolor: isActive('/signup') ? 'green' : 'transparent',
                '&:hover': { bgcolor: 'blue' },
              }}
            >
              <ListItemText primary="Sign Up" sx={{ color: isActive('/signup') ? 'white' : 'black' }} />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton
              component={Link}
              href="/dashboard"
              sx={{
                bgcolor: isActive('/dashboard') ? 'green' : 'transparent',
                '&:hover': { bgcolor: 'blue' },
              }}
            >
              <ListItemText primary="Use AI" sx={{ color: isActive('/dashboard') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/"
              sx={{
                bgcolor: isActive('/') ? 'green' : 'transparent',
                '&:hover': { bgcolor: 'blue' },
              }}
            >
              <ListItemText primary="Gallery" sx={{ color: isActive('/') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/blog"
              sx={{
                bgcolor: isActive('/history') ? 'green' : 'transparent',
                '&:hover': { bgcolor: 'blue' },
              }}
            >
              <ListItemText primary="BlogPosts" sx={{ color: isActive('/history') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              onClick={() => signOut()}
              sx={{
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'red' },
              }}
            >
              <ListItemText primary="Logout" sx={{ color: 'black' }} />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
