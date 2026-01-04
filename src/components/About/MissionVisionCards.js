import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
    GpsFixed as TargetIcon,
    Visibility as VisionIcon,
    Handshake as HandshakeIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { missionCardStyles, iconBoxStyles, cardWrapperStyle } from './styles';

const MissionVisionCards = () => {
    const { t } = useLanguage();

    const cards = [
        {
            icon: <TargetIcon sx={{ fontSize: '2.5rem', color: '#e63946' }} />,
            iconBg: 'rgba(230, 57, 70, 0.1)',
            title: t.about.mission,
            description: t.about.missionText,
            accentColor: '#e63946',
        },
        {
            icon: <VisionIcon sx={{ fontSize: '2.5rem', color: '#457b9d' }} />,
            iconBg: 'rgba(69, 123, 157, 0.1)',
            title: t.about.vision,
            description: t.about.visionText,
            accentColor: '#457b9d',
        },
        {
            icon: <HandshakeIcon sx={{ fontSize: '2.5rem', color: '#28a745' }} />,
            iconBg: 'rgba(40, 167, 69, 0.1)',
            title: t.about.howItWorks,
            description: t.about.howItWorksText,
            accentColor: '#28a745',
        },
    ];

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2, mb: 6 }}>
            {cards.map((card, index) => (
                <Box key={index} sx={cardWrapperStyle}>
                    <Paper
                        sx={{
                            ...missionCardStyles,
                            '&:hover .icon-box': {
                                transform: 'scale(1.1)',
                                boxShadow: `0 8px 25px ${card.iconBg}`,
                            },
                        }}
                    >
                        <Box className="icon-box" sx={iconBoxStyles(card.iconBg)}>
                            {card.icon}
                        </Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            gutterBottom
                            color="#1d3557"
                        >
                            {card.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                            {card.description}
                        </Typography>
                        <Box
                            sx={{
                                width: 50,
                                height: 4,
                                bgcolor: card.accentColor,
                                borderRadius: 2,
                                mx: 'auto',
                                mt: 3,
                            }}
                        />
                    </Paper>
                </Box>
            ))}
        </Box>
    );
};

export default MissionVisionCards;
