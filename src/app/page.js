"use client";
import { useState, useEffect } from 'react';
import { Box, TextField, Grid, Card, CardMedia, CardContent, Typography, Modal, Button } from '@mui/material';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const ImageLibrary = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    setFilteredImages(
      images.filter(image =>
        image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, images]);

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box sx={{ p: 2, margin: '0' }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        sx={{ mb: 3, margin: '0', padding: '0' }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={3} sx={{ margin: '0', padding: '0' }}>
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <Grid item key={image.id} sx={{ margin: '0', padding: '0' }}>
              <Card 
                sx={{ 
                  maxWidth: 345, 
                  height: 400,
                  margin: '0', 
                  padding: '0',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
                onClick={() => handleOpenModal(image)}
              >
                <CardMedia
                  component="img"
                  sx={{ 
                    height: '70%',
                    objectFit: 'cover',
                    margin: '0',
                    padding: '0',
                    boxSizing: 'border-box'
                  }}
                  image={image.url}
                  alt={image.prompt}
                />
                <CardContent sx={{ 
  flexGrow: 1,
  margin: '0', 
  padding: '0',
  boxSizing: 'border-box'
}}>
  <Typography variant="h6" component="div">
    {image.prompt.length > 30? `${image.prompt.substring(0, 30)}...` : image.prompt}
  </Typography>
</CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ margin: '0', padding: '0' }}>
            <Typography variant="h6" align="center">
              No results found
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Modal for displaying image and information */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%', 
            height:'70%',// Adjust the width as needed
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          {selectedImage && (
            <>
              <Box sx={{ flex: 1 }}>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',minHeight:"100%" }}>
                <Typography variant="h5" component="div" sx={{ mb: 1 }}>
                  provided by <strong>Visionary</strong>
                </Typography>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  {selectedImage.prompt}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  href={selectedImage.url} 
                  download
                >
                  Download
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageLibrary;
