import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {
  Construction as ConstructionIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useLanguage } from '../context';
import { ROUTES } from '../config/constants';

const UnderDevelopment = ({ pageName }) => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        pt: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            p: 6,
            borderRadius: 4,
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: 'rgba(230, 57, 70, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
            }}
          >
            <ConstructionIcon sx={{ fontSize: '4rem', color: '#e63946' }} />
          </Box>

          <Typography variant="h4" fontWeight={700} color="#1d3557" gutterBottom>
            {pageName || t.pages.underDevelopment}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t.pages.underDevelopmentMessage}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              component={Link}
              to={ROUTES.HOME}
              variant="contained"
              startIcon={<HomeIcon />}
              sx={{
                background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
              }}
            >
              {t.pages.backToHome}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnderDevelopment;
