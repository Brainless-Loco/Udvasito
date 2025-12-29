import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Avatar,
} from '@mui/material';
import {
    Bloodtype as BloodIcon,
    People as PeopleIcon,
    CheckCircle as AvailableIcon,
    Favorite as HeartIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { statsCardStyles } from './styles';

const StatsOverview = ({ stats, totalDonors }) => {
    const { t } = useLanguage();

    const statsData = [
        {
            icon: <PeopleIcon />,
            value: totalDonors,
            label: t.search.totalDonors || 'Total Donors',
            color: '#1d3557',
            bgColor: '#e3f2fd',
        },
        {
            icon: <AvailableIcon />,
            value: stats?.availableDonors || 0,
            label: t.search.availableNow || 'Available Now',
            color: '#28a745',
            bgColor: '#e8f5e9',
        },
        {
            icon: <HeartIcon />,
            value: stats?.experiencedDonors || 0,
            label: t.search.experiencedDonors || 'Experienced Donors',
            color: '#e63946',
            bgColor: '#ffebee',
        },
    ];

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            {statsData.map((stat, index) => (
                <Box
                    key={index}
                    sx={{
                        flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
                        minWidth: { xs: '100%', sm: 200 },
                    }}
                >
                    <Paper sx={statsCardStyles}>
                        <Avatar
                            sx={{
                                bgcolor: stat.bgColor,
                                color: stat.color,
                                width: 48,
                                height: 48,
                                mx: 'auto',
                                mb: 1,
                            }}
                        >
                            {stat.icon}
                        </Avatar>
                        <Typography variant="h4" fontWeight={700} color={stat.color}>
                            {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {stat.label}
                        </Typography>
                    </Paper>
                </Box>
            ))}
        </Box>
    );
};

export default StatsOverview;
