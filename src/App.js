import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LanguageProvider, FirebaseProvider } from './context';
import { Layout } from './components';
import { theme } from './config';
import { ROUTES } from './config/constants';
import {
  Home,
  FindDonor,
  DonorRegistration,
  VolunteerRegistration,
  About,
  FAQ,
  Testimonials,
  Gallery,
  Events,
  SuccessStories,
  Blogs,
  Contact,
  ProjectArchitecture,
} from './pages';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <FirebaseProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.FIND_DONOR} element={<FindDonor />} />
                <Route path={ROUTES.DONOR_REGISTRATION} element={<DonorRegistration />} />
                <Route path={ROUTES.VOLUNTEER_REGISTRATION} element={<VolunteerRegistration />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path={ROUTES.FAQ} element={<FAQ />} />
                <Route path={ROUTES.TESTIMONIALS} element={<Testimonials />} />
                <Route path={ROUTES.GALLERY} element={<Gallery />} />
                <Route path={ROUTES.EVENTS} element={<Events />} />
                <Route path={ROUTES.SUCCESS_STORIES} element={<SuccessStories />} />
                <Route path={ROUTES.BLOGS} element={<Blogs />} />
                <Route path={ROUTES.CONTACT} element={<Contact />} />
                <Route path={ROUTES.ARCHITECTURE} element={<ProjectArchitecture />} />
              </Routes>
            </Layout>
          </Router>
        </FirebaseProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
