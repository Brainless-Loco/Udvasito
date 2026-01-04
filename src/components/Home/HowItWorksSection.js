import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Groups as GroupsIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import { useScrollAnimation } from './hooks';
import { ParallaxSection } from './common';

const HowItWorksSection = () => {
  const [processRef, processVisible] = useScrollAnimation(0.2);

  const steps = [
    { step: '01', title: 'Register', desc: 'Sign up as a blood donor with your details', icon: <PersonAddIcon /> },
    { step: '02', title: 'Get Found', desc: 'Your profile becomes searchable to those in need', icon: <SearchIcon /> },
    { step: '03', title: 'Connect', desc: 'Receive requests from patients nearby', icon: <GroupsIcon /> },
    { step: '04', title: 'Donate', desc: 'Visit the hospital and donate blood', icon: <HeartIcon /> },
  ];

  return (
    <ParallaxSection bgColor="#1d3557" speed={0.3}>
      <Box ref={processRef} sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              mb: 8,
              opacity: processVisible ? 1 : 0,
              transform: processVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
              How It Works
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Four simple steps to save a life
            </Typography>
          </Box>

          {/* 4 items in a row, centered */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            {steps.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: 'calc(50% - 16px)', md: 200 },
                  minWidth: 160,
                  textAlign: 'center',
                  color: 'white',
                  opacity: processVisible ? 1 : 0,
                  transform: processVisible ? 'translateY(0)' : 'translateY(50px)',
                  transition: `all 0.8s ease-out ${0.2 + index * 0.15}s`,
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    position: 'relative',
                    background: 'rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '3px solid #e63946',
                      background: 'rgba(230,57,70,0.2)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: '2.5rem' } })}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 35,
                      height: 35,
                      borderRadius: '50%',
                      backgroundColor: '#e63946',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {item.step}
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </ParallaxSection>
  );
};

export default HowItWorksSection;
