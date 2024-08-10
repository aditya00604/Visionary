"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Typography, TextField, Box, List, ListItem, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { marked } from 'marked';

export default function HomePage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  const fetchBlogPosts = async (searchTitle = '', pageNumber = 1) => {
    try {
      const response = await axios.get('/api/blog', {
        params: {
          title: searchTitle,
          _limit: postsPerPage,
          _page: pageNumber
        }
      });

      // Assuming the response contains total count for pagination
      const totalPosts = parseInt(response.headers['x-total-count'], 10);
      setTotalPages(Math.ceil(totalPosts / postsPerPage));

      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  useEffect(() => {
    fetchBlogPosts(title, page);
  }, [title, page]);

  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
    fetchBlogPosts(title, 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const renderHTML = (html) => {
    return { __html: html };
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/blog/${postId}/delete`);
      fetchBlogPosts(title, page); // Refresh posts after deletion
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        Search Blog Posts
      </Typography>
      <TextField
        label="Search by title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSearch} className="mt-2">
        Search
      </Button>

      {blogPosts.length > 0 && (
        <>
          <List>
            {blogPosts.map((post) => (
              <ListItem key={post.id}>
                <Card className="w-full mb-4">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" gutterBottom>
                        {post.title}
                      </Typography>
                      {session && session.user && session.user.id === post.userId && (
                        <IconButton color="secondary" onClick={() => handleDelete(post.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      By: {post.user.email} {post.user.name && `(${post.user.name})`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created on: {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Comments: {post.commentsCount}
                    </Typography>
                    <Box className="relative">
                      <div className="content-preview overflow-hidden" style={{ height: '150px' }}>
                        <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button variant="outlined" color="primary" href={`/blog/${post.id}`}>
                      View Post
                    </Button>
                  </CardActions>
                </Card>
              </ListItem>
            ))}
          </List>

          <Box className="mt-4">
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="ml-2"
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
