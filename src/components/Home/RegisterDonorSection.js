import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
  PersonAdd as PersonAddIcon,
  Favorite as HeartIcon,
  LocalHospital as HospitalIcon,
  VolunteerActivism as VolunteerIcon,
  Replay as ReplayIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  Scale as ScaleIcon,
  Bloodtype as BloodIcon,
  HealthAndSafety as HealthIcon,
  MedicalServices as MedicalIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { ROUTES } from '../../config/constants';

const RegisterDonorSection = () => {
  const { t } = useLanguage();

  const benefits = [
    { icon: <HeartIcon />, text: t.registration.benefit1, color: '#e63946' },
    { icon: <HospitalIcon />, text: t.registration.benefit2, color: '#457b9d' },
    { icon: <VolunteerIcon />, text: t.registration.benefit3, color: '#2a9d8f' },
    { icon: <ReplayIcon />, text: t.registration.benefit4, color: '#f4a261' },
  ];

  const eligibilityCriteria = [
    { icon: <TimeIcon />, text: t.registration.ageRange, highlight: '18-65 years' },
    { icon: <ScaleIcon />, text: t.registration.minWeight, highlight: '50+ kg' },
    { icon: <BloodIcon />, text: t.registration.minHemoglobin, highlight: '12.5+ g/dL' },
    { icon: <HealthIcon />, text: t.registration.goodHealth, highlight: 'Good Health' },
    { icon: <MedicalIcon />, text: t.registration.noRecentSurgeries, highlight: 'No Recent Surgery' },
  ];

  return (
    <Box sx={{ py: 10, backgroundColor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom color="#1d3557">
            {t.registration.donorTitle}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {t.registration.donorSubtitle}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Benefits Grid - 2x2 */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={600} gutterBottom color="#1d3557" sx={{ mb: 3 }}>
              {t.registration.whyBecomeDonor}
            </Typography>
            <Grid container spacing={2}>
              {benefits.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      backgroundColor: 'white',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      border: '1px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                        borderColor: `${item.color}30`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin:'auto',
                        mb: 2,
                      }}
                    >
                      {React.cloneElement(item.icon, { sx: { color: item.color, fontSize: '1.8rem' } })}
                    </Box>
                    <Typography variant="body1" fontWeight={500}>
                      {item.text}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Eligibility & CTA */}
          <Grid item xs={12} md={6}>
            {/* Eligibility Criteria - Highlighted */}
            <Paper
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #1d3557 0%, #2a4a6d 100%)',
                borderRadius: 4,
                p: 4,
                mb: 3,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative background */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'rgba(230,57,70,0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(230,57,70,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircleIcon sx={{ color: '#e63946', fontSize: '1.5rem' }} />
                  </Box>
                  <Typography variant="h5" fontWeight={700} color="white">
                    {t.registration.eligibility}
                  </Typography>
                </Box>

                {/* Align the Eligibility Criteria in centered with even distance */}
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  {eligibilityCriteria.map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 35,
                            height: 35,
                            borderRadius: '10px',
                            backgroundColor: 'rgba(230,57,70,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {React.cloneElement(item.icon, { sx: { color: '#e63946', fontSize: '1.1rem' } })}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                            {item.text}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>

            {/* CTA Card */}
            <Paper
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                borderRadius: 4,
                p: 4,
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                    },
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: '2.5rem' }} />
                </Box>

                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Become a Donor Today
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                  Your donation can save up to 3 lives!
                </Typography>

                <Button
                  component={Link}
                  to={ROUTES.DONOR_REGISTRATION}
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    backgroundColor: 'white',
                    color: '#ffffffff',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: '#1d3557',
                      color: 'white',
                    },
                  }}
                >
                  Register Now
                </Button>

                <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.8 }}>
                  Takes only 2 minutes to complete
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisterDonorSection;
