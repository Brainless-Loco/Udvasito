import React from 'react';
import { Box, Container } from '@mui/material';
import { useLanguage, useFirebase } from '../../context';
import {
    AboutHero,
    MissionVisionCards,
    BloodFacts,
    AboutInitiative,
    CallToAction,
} from '../../components';
import { aboutPageStyles } from '../../components/About/styles';

const About = () => {
    const { t } = useLanguage();
    const { stats } = useFirebase();

    return (
        <Box sx={aboutPageStyles.container}>
            <Container maxWidth="lg">
                {/* Hero Section with Stats */}
                <AboutHero stats={stats} />

                {/* Mission, Vision, How It Works */}
                <MissionVisionCards />

                {/* Blood Donation Facts */}
                <BloodFacts />

                {/* About the Initiative */}
                <AboutInitiative />

                {/* Call to Action */}
                <CallToAction />
            </Container>
        </Box>
    );
};

export default About;
