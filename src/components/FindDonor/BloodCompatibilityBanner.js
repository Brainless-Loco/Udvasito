import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import {
    Info as InfoIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { compatibilityPaperStyles } from './styles';

const BloodCompatibilityBanner = () => {
    const { t } = useLanguage();

    const bloodTypeInfo = [
        {
            type: 'O-',
            label: t.compatibility.universalDonor,
            color: '#f4a261',
        },
        {
            type: 'AB+',
            label: t.compatibility.universalRecipient,
            color: '#2a9d8f',
        },
    ];

    return (
        <Paper sx={compatibilityPaperStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <InfoIcon sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                    {t.compatibility.title}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                {bloodTypeInfo.map((info, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        <Chip
                            label={info.type}
                            sx={{
                                backgroundColor: info.color,
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                minWidth: 50,
                            }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                            {info.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Typography
                variant="body2"
                sx={{
                    mt: 2,
                    opacity: 0.85,
                    fontStyle: 'italic',
                    borderLeft: '3px solid rgba(255,255,255,0.5)',
                    pl: 2,
                }}
            >
                {t.compatibility.note}
            </Typography>
        </Paper>
    );
};

export default BloodCompatibilityBanner;
