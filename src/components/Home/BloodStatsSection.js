import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useLanguage, useFirebase } from '../../context';
import { BLOOD_GROUPS } from '../../config/constants';
import { useScrollAnimation } from './hooks';
import { ParallaxSection, AnimatedCounter } from './common';

const BloodStatsSection = () => {
  const { t } = useLanguage();
  const { stats } = useFirebase();
  const [statsRef, statsVisible] = useScrollAnimation(0.2);

  return (
    <ParallaxSection bgColor="white" speed={0.2}>
      <Box ref={statsRef} sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              mb: 6,
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <Typography variant="h3" fontWeight={700} gutterBottom>
              {t.stats.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t.stats.subtitle}
            </Typography>
          </Box>

          {/* Flex wrap centered with equal width cards */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            {BLOOD_GROUPS.map((group, index) => (
              <Box
                key={group}
                sx={{
                  width: { xs: 'calc(25% - 18px)', sm: 130 },
                  minWidth: '22%',
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0) rotateX(0)' : 'translateY(40px) rotateX(20deg)',
                  transition: `all 0.6s ease-out ${0.1 + index * 0.08}s`,
                }}
              >
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                    color: 'white',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.05)',
                      boxShadow: '0 20px 40px rgba(230,57,70,0.4)',
                      '& .blood-drop-bg': {
                        transform: 'scale(1.5) rotate(20deg)',
                      },
                    },
                  }}
                >
                  {/* Background Blood Drop */}
                  <Box
                    className="blood-drop-bg"
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 130,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center', py: 3, px: 2, position: 'relative', zIndex: 1 }}>
                    <Typography variant="h3" fontWeight={800} sx={{ mb: 0.5 }}>
                      {group}
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      <AnimatedCounter end={stats.byBloodGroup[group] || 0} />
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t.stats.donors}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </ParallaxSection>
  );
};

export default BloodStatsSection;
