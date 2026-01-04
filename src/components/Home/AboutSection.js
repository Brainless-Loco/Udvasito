import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
  GpsFixed as TargetIcon,
  Visibility as VisionIcon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { SectionHeader } from '../../components';
import { useScrollAnimation } from './hooks';

const AboutSection = () => {
  const { t } = useLanguage();
  const [aboutRef, aboutVisible] = useScrollAnimation(0.2);

  const cards = [
    { icon: <TargetIcon />, title: t.about.mission, text: t.about.missionText, color: '#e63946' },
    { icon: <VisionIcon />, title: t.about.vision, text: t.about.visionText, color: '#1d3557' },
    { icon: <HandshakeIcon />, title: t.about.howItWorks, text: t.about.howItWorksText, color: '#457b9d' },
  ];

  return (
    <Box 
      ref={aboutRef}
      sx={{ 
        py: 12, 
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(230,57,70,0.1) 0%, rgba(230,57,70,0) 70%)',
          transform: aboutVisible ? 'scale(1)' : 'scale(0)',
          transition: 'transform 1s ease-out',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(29,53,87,0.05) 0%, rgba(29,53,87,0) 70%)',
          transform: aboutVisible ? 'scale(1)' : 'scale(0)',
          transition: 'transform 1.2s ease-out 0.2s',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            opacity: aboutVisible ? 1 : 0,
            transform: aboutVisible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <SectionHeader
            title={t.about.title}
            subtitle={t.about.subtitle}
          />
        </Box>

        {/* Minimal Mission/Vision/How It Works */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {cards.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'white',
                borderRadius: '10px',
                p: 2.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                opacity: aboutVisible ? 1 : 0,
                transform: aboutVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease-out ${0.1 + index * 0.1}s`,
                minWidth: { xs: '100%', sm: 300 },
                maxWidth: 350,
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {React.cloneElement(item.icon, { sx: { fontSize: '3.5rem', color: item.color } })}
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.85rem' }}>
                  {item.text.length > 80 ? item.text.substring(0, 80) + '...' : item.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSection;
