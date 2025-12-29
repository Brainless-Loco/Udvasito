import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  useScrollTrigger,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  PhotoLibrary as GalleryIcon,
  Event as EventIcon,
  EmojiEvents as SuccessIcon,
  Article as BlogIcon,
  Translate as TranslateIcon,
  MonitorHeart as HeartIcon,
  VolunteerActivism as VolunteerIcon,
  FormatQuote as QuoteIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { ROUTES } from '../../config/constants';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState(null);
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const isHome = location.pathname === '/';
  const isScrolled = trigger || !isHome;

  const navItems = [
    { label: t.nav.home, path: ROUTES.HOME, icon: <HomeIcon /> },
    { label: t.nav.findDonor, path: ROUTES.FIND_DONOR, icon: <SearchIcon /> },
    { label: t.nav.donorRegistration, path: ROUTES.DONOR_REGISTRATION, icon: <PersonAddIcon /> },
    { label: t.nav.about, path: ROUTES.ABOUT, icon: <InfoIcon /> },
    { label: t.nav.faq, path: ROUTES.FAQ, icon: <HelpIcon /> },
    { label: t.nav.testimonials, path: ROUTES.TESTIMONIALS, icon: <QuoteIcon /> },
    { label: t.nav.gallery, path: ROUTES.GALLERY, icon: <GalleryIcon /> },
    { label: t.nav.events, path: ROUTES.EVENTS, icon: <EventIcon /> },
    { label: t.nav.successStories, path: ROUTES.SUCCESS_STORIES, icon: <SuccessIcon /> },
    { label: t.nav.blogs, path: ROUTES.BLOGS, icon: <BlogIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLangClick = (event) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchor(null);
  };

  const handleLanguageChange = () => {
    toggleLanguage();
    handleLangClose();
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HeartIcon sx={{ animation: 'pulse 1.5s infinite' }} />
          <Typography variant="h6" fontWeight={800}>
            UDVASITO
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List >
        {navItems.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(230, 57, 70, 0.1)',
                borderRight: '3px solid #e63946',
              },
              '&:hover': {
                backgroundColor: 'rgba(230, 57, 70, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#e63946' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                color: location.pathname === item.path ? '#e63946' : 'inherit',
              }}
            />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem
          button
          component={Link}
          to={ROUTES.VOLUNTEER_REGISTRATION}
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <VolunteerIcon />
          </ListItemIcon>
          <ListItemText primary={t.nav.volunteerRegistration} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: isScrolled ? 'white' : 'transparent',
          boxShadow: isScrolled ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: isScrolled ? '#e63946' : 'white',
            }}
          >
            <HeartIcon
              sx={{
                fontSize: '2rem',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                },
              }}
            />
            <Typography variant="h5" fontWeight={800}>
              UDVASITO
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              flexGrow: 1,
            }}
          >
            {navItems.slice(0, 6).map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: isScrolled ? '#1d3557' : 'white',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  backgroundColor:
                    location.pathname === item.path ? 'rgba(230, 57, 70, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isScrolled ? '#1d3557' : 'rgba(255,255,255,0.2)',
                    color: isScrolled ? 'white' : 'white',
                  },
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Language Toggle */}
          <IconButton
            onClick={handleLangClick}
            sx={{
              color: isScrolled ? '#1d3557' : 'white',
              ml: 1,
            }}
          >
            <TranslateIcon />
          </IconButton>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={handleLangClose}
          >
            <MenuItem
              onClick={handleLanguageChange}
              selected={language === 'en'}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={handleLanguageChange}
              selected={language === 'bn'}
            >
              Bangla
            </MenuItem>
          </Menu>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              display: { lg: 'none' },
              color: isScrolled ? '#1d3557' : 'white',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
