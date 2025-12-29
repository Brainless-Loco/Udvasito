import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import {
  Timer as TimerIcon,
  Replay as ReplayIcon,
  LocalHospital as HospitalIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { useScrollAnimation } from './hooks';

const BloodFactsSection = () => {
  const { t } = useLanguage();
  const [factsRef, factsVisible] = useScrollAnimation(0.2);

  const facts = [
    { icon: <TimerIcon />, text: t.about.fact1, color: '#e63946' },
    { icon: <HeartIcon />, text: t.about.fact2, color: '#ff6b6b' },
    { icon: <HospitalIcon />, text: t.about.fact3, color: '#1d3557' },
    { icon: <ReplayIcon />, text: t.about.fact4, color: '#457b9d' },
  ];

  return (
    <Box ref={factsRef} sx={{ py: 10, backgroundColor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            opacity: factsVisible ? 1 : 0,
            transform: factsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {t.about.factsTitle}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Important facts about blood donation
          </Typography>
        </Box>

        {/* 4 items in a row, centered */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          {facts.map((fact, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: 'calc(50% - 12px)', md: 250 },
                minWidth: 200,
                textAlign: 'center',
                p: 4,
                backgroundColor: 'white',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                opacity: factsVisible ? 1 : 0,
                transform: factsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transition: `all 0.6s ease-out ${0.1 + index * 0.1}s`,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  '& .fact-icon': {
                    transform: 'rotateY(360deg)',
                  },
                },
              }}
            >
              <Box
                className="fact-icon"
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${fact.color}20, ${fact.color}05)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  transition: 'transform 0.6s ease',
                }}
              >
                {React.cloneElement(fact.icon, { sx: { fontSize: '2rem', color: fact.color } })}
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {fact.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default BloodFactsSection;
