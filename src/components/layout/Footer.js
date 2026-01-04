import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { ROUTES, BLOOD_GROUPS, SOCIAL_LINKS } from '../../config/constants';

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t.nav.home, path: ROUTES.HOME },
    { label: t.nav.findDonor, path: ROUTES.FIND_DONOR },
    { label: t.nav.donorRegistration, path: ROUTES.DONOR_REGISTRATION },
    { label: t.nav.about, path: ROUTES.ABOUT },
    { label: t.nav.faq, path: ROUTES.FAQ },
    { label: t.nav.testimonials, path: ROUTES.TESTIMONIALS },
    { label: t.nav.gallery, path: ROUTES.GALLERY },
    { label: t.nav.events, path: ROUTES.EVENTS },
    { label: t.nav.successStories, path: ROUTES.SUCCESS_STORIES },
    { label: t.nav.blogs, path: ROUTES.BLOGS },
    { label: t.nav.contact, path: ROUTES.CONTACT },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1d3557',
        color: 'white',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                component="img"
                src="/assets/logo-red.png"
                alt="UDVASITO"
                sx={{
                  height: '2.5rem',
                  width: 'auto',
                }}
              />
              <Typography variant="h5" fontWeight={800}>
                UDVASITO
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              {t.footer.tagline}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: 'italic' }}>
              {t.footer.initiative}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <IconButton
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                sx={{ color: 'white', '&:hover': { color: '#e63946' } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                sx={{ color: 'white', '&:hover': { color: '#e63946' } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                sx={{ color: 'white', '&:hover': { color: '#e63946' } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                sx={{ color: 'white', '&:hover': { color: '#e63946' } }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t.footer.quickLinks}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {quickLinks.map((link) => (
                <Box component="li" key={link.path} sx={{ mb: 1 }}>
                  <Box
                    component={Link}
                    to={link.path}
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      '&:hover': {
                        color: '#e63946',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Blood Groups */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t.footer.bloodGroups}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {BLOOD_GROUPS.map((group) => (
                <Box
                  key={group}
                  sx={{
                    backgroundColor: 'rgba(230, 57, 70, 0.2)',
                    color: '#ff6b6b',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {group}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              opacity: 0.8,
            }}
          >
            <CodeIcon fontSize="small" />
            {t.footer.developedBy} <strong>Tonmoy and Hisan</strong>
            {/* {t.footer.department} */}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} {t.footer.copyright} | {t.footer.everyDropCounts}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
