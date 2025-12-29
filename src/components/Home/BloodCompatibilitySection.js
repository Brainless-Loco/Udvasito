import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Grid, Chip, Button } from '@mui/material';
import {
  Bloodtype as BloodIcon,
  Favorite as HeartIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { ROUTES, BLOOD_GROUPS } from '../../config/constants';

const BloodCompatibilitySection = () => {
  const { t } = useLanguage();

  return (
    <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}
            >
              <BloodIcon sx={{ fontSize: '2rem' }} />
              {t.compatibility.title}
            </Typography>

            <Grid container spacing={4} alignItems="center">
              {/* Universal Donor & Recipient */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 3,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        transform: 'translateX(10px)',
                      },
                    }}
                  >
                    <Chip
                      label="O-"
                      sx={{
                        backgroundColor: '#f4a261',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1.3rem',
                        py: 2.5,
                        px: 1,
                        borderRadius: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {t.compatibility.universalDonor}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Can donate to all blood types
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 3,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        transform: 'translateX(10px)',
                      },
                    }}
                  >
                    <Chip
                      label="AB+"
                      sx={{
                        backgroundColor: '#2a9d8f',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1.3rem',
                        py: 2.5,
                        px: 1,
                        borderRadius: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {t.compatibility.universalRecipient}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Can receive from all blood types
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Compatibility Chart */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    p: 3,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                    Quick Reference
                  </Typography>
                  <Grid container spacing={1}>
                    {BLOOD_GROUPS.map((group) => (
                      <Grid item xs={3} key={group}>
                        <Box
                          sx={{
                            textAlign: 'center',
                            p: 1.5,
                            backgroundColor: 'rgba(230,57,70,0.2)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(230,57,70,0.4)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <Typography variant="h6" fontWeight={700}>
                            {group}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Typography
                    variant="body2"
                    sx={{ mt: 3, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <HeartIcon sx={{ fontSize: '1rem' }} />
                    {t.compatibility.note}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* CTA */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                component={Link}
                to={ROUTES.FIND_DONOR}
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
                sx={{
                  backgroundColor: 'white',
                  color: '#1d3557',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#e63946',
                    color: 'white',
                  },
                }}
              >
                {t.search.findDonor}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BloodCompatibilitySection;
