import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
  Search as SearchIcon,
  Emergency as EmergencyIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { ROUTES } from '../../config/constants';

const EmergencyCtaSection = () => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated pulse effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'pulse-bg 3s ease-in-out infinite',
          '@keyframes pulse-bg': {
            '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            '50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.5 },
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            p: 5,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                },
              }}
            >
              <EmergencyIcon sx={{ fontSize: '4rem', color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} color="white">
                {t.emergency.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                {t.emergency.description}
              </Typography>
            </Box>
          </Box>
          <Button
            component={Link}
            to={ROUTES.FIND_DONOR}
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            sx={{
              backgroundColor: 'white',
              color: '#1d3557',
              px: 5,
              py: 2,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: '1.1rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#1d3557',
                color: 'white',
                transform: 'scale(1.05)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              },
            }}
          >
            {t.emergency.findNow}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EmergencyCtaSection;
