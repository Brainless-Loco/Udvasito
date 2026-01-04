import React from 'react';
import Box from '@mui/material/Box';
import {
  HeroSection,
  AboutSection,
  HowItWorksSection,
  BloodFactsSection,
  BloodCompatibilitySection,
  BloodStatsSection,
  ImpactSection,
  RegisterDonorSection,
  EmergencyCtaSection,
  CreditsSection,
} from '../components/Home';

const Home = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <HeroSection />

      {/* About Section - Mission, Vision, How It Works */}
      <AboutSection />

      {/* How It Works - Process Steps */}
      <HowItWorksSection />

      {/* Blood Donation Facts */}
      <BloodFactsSection />

      {/* Blood Compatibility Guide */}
      <BloodCompatibilitySection />

      {/* Blood Group Statistics */}
      <BloodStatsSection />

      {/* Impact Section */}
      <ImpactSection />

      {/* Register as Blood Donor */}
      <RegisterDonorSection />

      {/* Emergency CTA */}
      <EmergencyCtaSection />

      {/* Credits Section */}
      <CreditsSection />
    </Box>
  );
};

export default Home;
