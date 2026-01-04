import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
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
  VolunteerActivism as VolunteerIcon,
  FormatQuote as QuoteIcon,
  MoreHoriz as MoreIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { ROUTES } from '../../config/constants';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState(null);
  const [moreAnchor, setMoreAnchor] = useState(null);
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

  const handleMoreClick = (event) => {
    setMoreAnchor(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchor(null);
  };

  // Main nav items (shown directly)
  const mainNavItems = navItems.slice(0, 5);
  // More nav items (shown in dropdown)
  const moreNavItems = navItems.slice(5);

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
          {/* place the logo red here */}
          <Box
            component="img"
            src="/assets/logo-white.png"
            alt="UDVASITO"
            sx={{
              height: '2rem',
              width: 'auto',
            }}
          />
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
          to={ROUTES.AVAILABILITY_REQUEST}
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Update Availability" />
        </ListItem>
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
              gap: 1.5,
              textDecoration: 'none',
              color: isScrolled ? '#e63946' : 'white',
            }}
          >
            <Box
              component="img"
              src={isScrolled ? '/assets/logo-red.png' : '/assets/logo-white.png'}
              alt="UDVASITO"
              sx={{
                height: '2.5rem',
                width: 'auto',
                transition: 'all 0.3s ease',
              }}
            />
            <Box className="mt-auto">
              <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 0 }}>
                UDVASITO
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.7rem',
                  marginTop: '-4px',
                  fontWeight: 600,
                  color: isScrolled ? '#e63946' : 'rgba(255,255,255,0.9)',
                  transition: 'color 0.3s ease',
                }}
              >
                Blood Donor Directory
              </Typography>
            </Box>
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
            {mainNavItems.map((item) => (
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

            {/* More Dropdown */}
            {moreNavItems.length > 0 && (
              <>
                <Button
                  onClick={handleMoreClick}
                  endIcon={<MoreIcon />}
                  sx={{
                    color: isScrolled ? '#1d3557' : 'white',
                    fontWeight: 500,
                    backgroundColor: moreNavItems.some(item => location.pathname === item.path)
                      ? 'rgba(230, 57, 70, 0.1)'
                      : 'transparent',
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
                  {t.nav.more || 'More'}
                </Button>
                <Menu
                  anchorEl={moreAnchor}
                  open={Boolean(moreAnchor)}
                  onClose={handleMoreClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {moreNavItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      component={Link}
                      to={item.path}
                      onClick={handleMoreClose}
                      selected={location.pathname === item.path}
                      sx={{
                        gap: 1.5,
                        py: 1.5,
                        px: 2.5,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(230, 57, 70, 0.1)',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(230, 57, 70, 0.05)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 'auto', color: location.pathname === item.path ? '#e63946' : 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <Typography
                        sx={{
                          fontWeight: location.pathname === item.path ? 600 : 400,
                          color: location.pathname === item.path ? '#e63946' : 'inherit',
                        }}
                      >
                        {item.label}
                      </Typography>
                    </MenuItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    component={Link}
                    to={ROUTES.AVAILABILITY_REQUEST}
                    onClick={handleMoreClose}
                    sx={{ gap: 1.5, py: 1.5, px: 2.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <EditIcon />
                    </ListItemIcon>
                    <Typography>Update Availability</Typography>
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    component={Link}
                    to={ROUTES.VOLUNTEER_REGISTRATION}
                    onClick={handleMoreClose}
                    sx={{ gap: 1.5, py: 1.5, px: 2.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <VolunteerIcon />
                    </ListItemIcon>
                    <Typography>{t.nav.volunteerRegistration}</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
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
              ml: 'auto',
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
