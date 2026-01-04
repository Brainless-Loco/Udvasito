import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

import {
  Architecture as ArchitectureIcon,
  Folder as FolderIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { SectionHeader } from '../components';

const ProjectArchitecture = () => {
  const techStack = [
    { name: 'React 18', description: 'Frontend Framework' },
    { name: 'Material UI (MUI)', description: 'UI Component Library' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS Framework' },
    { name: 'Firebase', description: 'Backend as a Service (Firestore, Auth, Storage)' },
    { name: 'EmailJS', description: 'Email Service for Automated Emails' },
    { name: 'React Router v6', description: 'Client-side Routing' },
  ];

//   const folderStructure = [
//     { folder: 'src/', description: 'Main source directory' },
//     { folder: 'src/components/', description: 'Reusable UI components' },
//     { folder: 'src/components/layout/', description: 'Layout components (Navbar, Footer, Layout)' },
//     { folder: 'src/components/common/', description: 'Common components (Cards, Headers, Loading)' },
//     { folder: 'src/config/', description: 'Configuration files (Firebase, Theme, Constants)' },
//     { folder: 'src/context/', description: 'React Context providers (Language, Firebase)' },
//     { folder: 'src/locales/', description: 'Translation dictionaries (English, Bangla)' },
//     { folder: 'src/pages/', description: 'Page components' },
//     { folder: 'src/services/', description: 'Service utilities (Email service)' },
//   ];

  const features = [
    { icon: <LanguageIcon />, title: 'Bilingual Support', description: 'Full Bangla and English translations with toggle' },
    { icon: <StorageIcon />, title: 'Firebase Integration', description: 'Firestore for data storage, real-time updates' },
    { icon: <EmailIcon />, title: 'Automated Emails', description: 'Welcome emails sent automatically on registration' },
    { icon: <PaletteIcon />, title: 'Themed UI', description: 'Consistent theme matching legacy design' },
    { icon: <SecurityIcon />, title: 'Environment Variables', description: 'Secure configuration via .env file' },
  ];

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <SectionHeader
          icon={ArchitectureIcon}
          title="Project Architecture"
          subtitle="Documentation of the UDVASITO React Application Structure"
        />

        {/* Tech Stack */}
        <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon sx={{ color: '#e63946' }} />
            Technology Stack
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {techStack.map((tech) => (
              <Chip
                key={tech.name}
                label={`${tech.name} - ${tech.description}`}
                sx={{
                  backgroundColor: 'rgba(230, 57, 70, 0.1)',
                  color: '#c1121f',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Folder Structure */}
        <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderIcon sx={{ color: '#457b9d' }} />
            Project Structure
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: '#1d3557',
              color: '#a8dadc',
              p: 3,
              borderRadius: 2,
              overflow: 'auto',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
{`udvasito/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── DonorCard.js
│   │   │   ├── Loading.js
│   │   │   ├── SectionHeader.js
│   │   │   ├── StatCard.js
│   │   │   └── index.js
│   │   ├── layout/
│   │   │   ├── Footer.js
│   │   │   ├── Layout.js
│   │   │   ├── Navbar.js
│   │   │   └── index.js
│   │   └── index.js
│   ├── config/
│   │   ├── constants.js
│   │   ├── firebase.js
│   │   ├── theme.js
│   │   └── index.js
│   ├── context/
│   │   ├── FirebaseContext.js
│   │   ├── LanguageContext.js
│   │   └── index.js
│   ├── locales/
│   │   ├── bn.js (Bangla)
│   │   ├── en.js (English)
│   │   └── index.js
│   ├── pages/
│   │   ├── About.js
│   │   ├── Blogs.js
│   │   ├── Contact.js
│   │   ├── DonorRegistration.js
│   │   ├── Events.js
│   │   ├── FAQ.js
│   │   ├── FindDonor.js
│   │   ├── Gallery.js
│   │   ├── Home.js
│   │   ├── ProjectArchitecture.js
│   │   ├── SuccessStories.js
│   │   ├── Testimonials.js
│   │   ├── UnderDevelopment.js
│   │   ├── VolunteerRegistration.js
│   │   └── index.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── index.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env
├── .env.example
├── package.json
└── tailwind.config.js`}
          </Box>
        </Paper>

        {/* Key Features */}
        <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon sx={{ color: '#28a745' }} />
            Key Features
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    height: '100%',
                  }}
                >
                  <Box sx={{ color: '#e63946', mb: 1 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Environment Variables */}
        <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon sx={{ color: '#ffc107' }} />
            Environment Variables (.env)
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: '#1d3557',
              color: '#a8dadc',
              p: 3,
              borderRadius: 2,
              overflow: 'auto',
              fontSize: '0.9rem',
            }}
          >
{`# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID_DONOR=your_donor_template
REACT_APP_EMAILJS_TEMPLATE_ID_VOLUNTEER=your_volunteer_template
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key`}
          </Box>
        </Paper>

        {/* Firebase Collections */}
        <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorageIcon sx={{ color: '#ff6b6b' }} />
            Firebase Collections
          </Typography>
          <List>
            {[
              { name: 'donors', description: 'Registered blood donors data' },
              { name: 'volunteers', description: 'Registered volunteers data' },
              { name: 'events', description: 'Blood donation events' },
              { name: 'blogs', description: 'Blog posts and articles' },
              { name: 'successStories', description: 'Success stories from donors/recipients' },
              { name: 'gallery', description: 'Photo gallery items' },
              { name: 'faq', description: 'Frequently asked questions' },
              { name: 'testimonials', description: 'Testimonials from users' },
            ].map((collection) => (
              <ListItem key={collection.name}>
                <ListItemIcon>
                  <Chip
                    label={collection.name}
                    size="small"
                    sx={{ backgroundColor: '#e63946', color: 'white', fontWeight: 600 }}
                  />
                </ListItemIcon>
                <ListItemText primary={collection.description} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Pages Overview */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon sx={{ color: '#457b9d' }} />
            Pages & Routes
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { route: '/', page: 'Home', status: 'Complete' },
              { route: '/find-donor', page: 'Find Donor', status: 'Complete' },
              { route: '/donor-registration', page: 'Donor Registration', status: 'Complete' },
              { route: '/volunteer-registration', page: 'Volunteer Registration', status: 'Complete' },
              { route: '/about', page: 'About', status: 'Complete' },
              { route: '/faq', page: 'FAQ', status: 'Under Development' },
              { route: '/testimonials', page: 'Words of Impact', status: 'Under Development' },
              { route: '/gallery', page: 'Gallery', status: 'Under Development' },
              { route: '/events', page: 'Events', status: 'Under Development' },
              { route: '/success-stories', page: 'Success Stories', status: 'Under Development' },
              { route: '/blogs', page: 'Blogs', status: 'Under Development' },
              { route: '/contact', page: 'Contact', status: 'Under Development' },
              { route: '/architecture', page: 'Architecture Docs', status: 'Complete' },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.route}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #e9ecef',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {item.page}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.route}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      backgroundColor: item.status === 'Complete' ? '#28a745' : '#ffc107',
                      color: item.status === 'Complete' ? 'white' : '#1d3557',
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProjectArchitecture;
