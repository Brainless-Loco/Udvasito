import React from 'react';
import { Box, Container, Typography, Avatar, IconButton } from '@mui/material';
import {
  Code as CodeIcon,
  Favorite as HeartIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const CreditsSection = () => {
  const developers = [
    {
      name: 'Tonmoy',
      image: '/assets/credit/tonmoy.jpg',
      color: '#457b9d',
      github: 'https://github.com/Brainless-Loco',
      linkedin: 'https://linkedin.com/in/-tonmoy-das-',
      facebook: '',
    },
    {
      name: 'Hasin',
      image: '/assets/credit/hasin.jpg',
      color: '#457b9d',
      github: '',
      linkedin: '',
      facebook: 'https://www.facebook.com/shakibrahmanhisan/',
    },
  ];

  // Get available social links (max 2)
  const getSocialLinks = (dev) => {
    const links = [];
    if (dev.github) links.push({ type: 'github', url: dev.github, icon: <GitHubIcon sx={{ fontSize: '1rem' }} />, hoverColor: 'white' });
    if (dev.linkedin) links.push({ type: 'linkedin', url: dev.linkedin, icon: <LinkedInIcon sx={{ fontSize: '1rem' }} />, hoverColor: '#0077b5' });
    if (dev.facebook) links.push({ type: 'facebook', url: dev.facebook, icon: <FacebookIcon sx={{ fontSize: '1rem' }} />, hoverColor: '#1877f2' });
    return links.slice(0, 2);
  };

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

          {/* Developer Cards - Larger Cards */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mb: 4 }}>
            {developers.map((dev, index) => {
              const socialLinks = getSocialLinks(dev);
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '15px',
                    px: 4,
                    py: 3,
                    width: 250,
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <Avatar
                    src={dev.image}
                    alt={dev.name}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      border: `3px solid ${dev.color}`,
                      boxShadow: `0 4px 15px ${dev.color}44`,
                    }}
                  >
                    {dev.name.charAt(0)}
                  </Avatar>
                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight={600} color="white">
                      {dev.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {dev.name === 'Hasin' ? 'Initiator & Developer' : 'Developer'}
                    </Typography>
                  </Box>
                  {socialLinks.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {socialLinks.map((link) => (
                        <IconButton
                          key={link.type}
                          size="small"
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'rgba(255,255,255,0.5)',
                            p: 1,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            '&:hover': { 
                              color: link.hoverColor,
                              backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          {link.icon}
                        </IconButton>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
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
