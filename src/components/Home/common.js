import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useScrollAnimation } from './hooks';

// Parallax component
export const ParallaxSection = ({ children, speed = 0.5, bgImage, bgColor, overlay }) => {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const scrolled = window.scrollY;
        const rate = scrolled * speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...(bgColor && { backgroundColor: bgColor }),
      }}
    >
      {bgImage && (
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            left: 0,
            right: 0,
            bottom: -100,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${offset * 0.3}px)`,
            zIndex: 0,
          }}
        />
      )}
      {overlay && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: overlay,
            zIndex: 1,
          }}
        />
      )}
      <Box sx={{ position: 'relative', zIndex: 2 }}>{children}</Box>
    </Box>
  );
};

// Animated counter component
export const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollAnimation(0.5);

  useEffect(() => {
    if (isVisible && count === 0) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isVisible, end, duration, count]);

  return <span ref={ref}>{count}{suffix}</span>;
};
