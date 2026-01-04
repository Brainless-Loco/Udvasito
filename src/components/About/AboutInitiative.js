import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import {
    School as SchoolIcon,
    Groups as CommunityIcon,
    Favorite as HeartIcon,
    EmojiEvents as AwardIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';

const AboutInitiative = () => {
    const { t } = useLanguage();

    const highlights = [
        { icon: <SchoolIcon />, text: 'University of Chittagong' },
        { icon: <CommunityIcon />, text: 'Student-led Initiative' },
        { icon: <HeartIcon />, text: 'Volunteer-driven' },
        { icon: <AwardIcon />, text: 'Community Impact' },
    ];

    return (
        <Paper
            sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                mb: 6,
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                        sx={{
                            bgcolor: 'rgba(230, 57, 70, 0.9)',
                            width: 56,
                            height: 56,
                        }}
                    >
                        <HeartIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            {t.footer.initiative || 'About UDVASITO'}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.85 }}>
                            {t.about.initiativeTagline || 'Connecting Hearts, Saving Lives'}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8, mb: 4, maxWidth: 800 }}>
                    {t.about.initiativeDescription || 
                    `UDVASITO is a blood donor directory initiative aimed at connecting donors with those in need, 
                    particularly within the University of Chittagong community and beyond. Our platform makes it 
                    easy to find compatible blood donors during emergencies and promotes a culture of regular 
                    blood donation.`}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {highlights.map((item, index) => (
                        <Chip
                            key={index}
                            icon={item.icon}
                            label={item.text}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                    color: 'white',
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.25)',
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

export default AboutInitiative;
