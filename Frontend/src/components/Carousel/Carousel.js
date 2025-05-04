import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1920&h=600',
    title: 'Chào mừng tới HND Store',
    description: 'Khám phá thế giới công nghệ mới',
    buttonText: 'Mua ngay',
    buttonLink: '/products',
  },
  {
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1920&h=600',
    title: 'Thiên đường của các game thủ',
    description: 'Nâng tầm trải nghiệm chơi game của bạn',
    buttonText: 'Khám phá thế giới Gaming',
    buttonLink: '/products?category=gaming',
  },
  {
    url: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=1920&h=600',
    title: 'Công nghệ tân tiến',
    description: 'Tăng năng suất làm việc của bạn',
    buttonText: 'Xem Laptop',
    buttonLink: '/products?category=laptops',
  },
];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      handleNext();
    }
    if (touchStart - touchEnd < -100) {
      handlePrev();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          position: 'relative',
          width: '90%',
          maxWidth: '1600px',
          height: '500px',
          overflow: 'hidden',
          boxShadow: 3,
          borderRadius: 2,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentIndex * 100}%)`,
            height: '100%',
          }}
        >
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                minWidth: '100%',
                height: '100%',
                display: 'flex',
                position: 'relative',
              }}
            >
              {/* Image Section (2/3) */}
              <Box
                sx={{
                  width: '66.67%',
                  height: '100%',
                  backgroundImage: `url(${slide.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* Content Section (1/3) */}
              <Box
                sx={{
                  width: '33.33%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: { xs: 2, sm: 3, md: 4 },
                  backgroundColor: 'background.paper',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(165deg, #f5f5f5 0%, #ffffff 100%)',
                    zIndex: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                      fontWeight: 700,
                      color: 'primary.main',
                      lineHeight: 1.2,
                      mb: 3,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    align="center"
                    paragraph
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                      color: 'text.secondary',
                      mb: 4,
                      fontWeight: 500,
                      maxWidth: '90%',
                      mx: 'auto',
                    }}
                  >
                    {slide.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={RouterLink}
                    to={slide.buttonLink}
                    sx={{
                      py: { xs: 1, sm: 1.5 },
                      px: { xs: 3, sm: 4 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'scale(1.02)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  >
                    {slide.buttonText}
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Navigation Arrows */}
        <IconButton
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={handlePrev}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={handleNext}
        >
          <KeyboardArrowRight />
        </IconButton>

        {/* Dots Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Carousel; 