import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useFirebase } from '../../context';
import {
    AboutHero,
    MissionVisionCards,
    BloodFacts,
    AboutInitiative,
    CallToAction,
} from '../../components';
import { aboutPageStyles } from '../../components/About/styles';

const About = () => {
    // const { t } = useLanguage();
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
