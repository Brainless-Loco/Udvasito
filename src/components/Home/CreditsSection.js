import React from 'react';
import { Box, Container, Typography, Avatar, IconButton } from '@mui/material';
import {
  Code as CodeIcon,
  Favorite as HeartIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const CreditsSection = () => {
  const developers = [
    { name: 'Tonmoy', avatar: 'T', color: '#e63946' },
    { name: 'Hisan', avatar: 'H', color: '#457b9d' },
  ];

  return (
    <Box
      sx={{
        py: 5,
        backgroundColor: '#0a1929',
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center">
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <CodeIcon sx={{ color: '#e63946', fontSize: '1.3rem' }} />
            <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
              Developed With Love
            </Typography>
            <HeartIcon sx={{ color: '#e63946', fontSize: '1.3rem' }} />
          </Box>

          {/* Developer Cards - Compact Row */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            {developers.map((dev, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: '1rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${dev.color}, ${dev.color}88)`,
                  }}
                >
                  {dev.avatar}
                </Avatar>
                <Box textAlign="left">
                  <Typography variant="body2" fontWeight={600} color="white">
                    {dev.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Developer
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                  <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)', p: 0.5, '&:hover': { color: 'white' } }}>
                    <GitHubIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)', p: 0.5, '&:hover': { color: '#0077b5' } }}>
                    <LinkedInIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          {/* University Badge - Inline */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <SchoolIcon sx={{ color: '#a8dadc', fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              University of Chittagong
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} UDVASITO. Made with ❤️ for humanity.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CreditsSection;
