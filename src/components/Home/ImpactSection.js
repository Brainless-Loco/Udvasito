import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import {
  Favorite as HeartIcon,
  TrendingUp as TrendingIcon,
  Groups as GroupsIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useFirebase } from '../../context';
import { useScrollAnimation } from './hooks';
import { AnimatedCounter } from './common';

const ImpactSection = () => {
  const { stats } = useFirebase();
  const [impactRef, impactVisible] = useScrollAnimation(0.2);

  const impactStats = [
    { icon: <HeartIcon />, value: stats.total * 3, label: 'Lives Potentially Saved', suffix: '+' },
    { icon: <TrendingIcon />, value: 100, label: 'Success Rate', suffix: '%' },
    { icon: <LocationIcon />, value: 50, label: 'Districts Covered', suffix: '+' },
    { icon: <GroupsIcon />, value: stats.available, label: 'Active Donors', suffix: '' },
  ];

  return (
    <Box
      ref={impactRef}
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated circles */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 100 + i * 100,
            height: 100 + i * 100,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.05)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `pulse-ring ${3 + i}s ease-out infinite`,
            '@keyframes pulse-ring': {
              '0%': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 1 },
              '100%': { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 },
            },
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
            opacity: impactVisible ? 1 : 0,
            transform: impactVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
            Our Impact
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Together, we're making a difference
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {impactStats.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  opacity: impactVisible ? 1 : 0,
                  transform: impactVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.8s ease-out ${0.2 + index * 0.1}s`,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(230,57,70,0.3)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: '2rem' } })}
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  <AnimatedCounter end={item.value} suffix={item.suffix} />
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ImpactSection;
