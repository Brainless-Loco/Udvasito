import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  GpsFixed as TargetIcon,
  Visibility as VisionIcon,
  Handshake as HandshakeIcon,
  Timer as TimerIcon,
  Replay as ReplayIcon,
  LocalHospital as HospitalIcon,
  Favorite as HeartIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useLanguage } from '../context';
import { SectionHeader } from '../components';

const About = () => {
  const { t } = useLanguage();

  const facts = [
    { icon: <TimerIcon sx={{ fontSize: '2.5rem' }} />, text: t.about.fact1 },
    { icon: <HeartIcon sx={{ fontSize: '2.5rem' }} />, text: t.about.fact2 },
    { icon: <HospitalIcon sx={{ fontSize: '2.5rem' }} />, text: t.about.fact3 },
    { icon: <ReplayIcon sx={{ fontSize: '2.5rem' }} />, text: t.about.fact4 },
  ];

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <SectionHeader
          icon={InfoIcon}
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(230, 57, 70, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <TargetIcon sx={{ fontSize: '2.5rem', color: '#e63946' }} />
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {t.about.mission}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t.about.missionText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(69, 123, 157, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <VisionIcon sx={{ fontSize: '2.5rem', color: '#457b9d' }} />
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {t.about.vision}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t.about.visionText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <HandshakeIcon sx={{ fontSize: '2.5rem', color: '#28a745' }} />
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {t.about.howItWorks}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t.about.howItWorksText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Blood Facts */}
        <Box sx={{ backgroundColor: 'white', borderRadius: 4, p: 6 }}>
          <Typography
            variant="h4"
            fontWeight={600}
            textAlign="center"
            sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}
          >
            <HeartIcon sx={{ color: '#e63946' }} />
            {t.about.facts}
          </Typography>
          <Grid container spacing={4}>
            {facts.map((fact, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#f8f9fa',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ color: '#e63946', mb: 2 }}>{fact.icon}</Box>
                  <Typography variant="body1" fontWeight={500}>
                    {fact.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Initiative Info */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {t.footer.initiative}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            UDVASITO is a blood donor directory initiative aimed at connecting donors with those in need,
            particularly within the University of Chittagong community and beyond.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
