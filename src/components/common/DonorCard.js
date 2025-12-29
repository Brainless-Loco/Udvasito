import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  CheckCircle as AvailableIcon,
  Cancel as UnavailableIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';

const DonorCard = ({ donor, onViewDetails }) => {
  const { t } = useLanguage();

  const getBloodGroupColor = (group) => {
    const colors = {
      'A+': '#e63946',
      'A-': '#c1121f',
      'B+': '#457b9d',
      'B-': '#1d3557',
      'AB+': '#2a9d8f',
      'AB-': '#264653',
      'O+': '#e9c46a',
      'O-': '#f4a261',
    };
    return colors[group] || '#e63946';
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      {/* Blood Group Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: -15,
          right: 20,
          backgroundColor: getBloodGroupColor(donor.bloodGroup),
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: 3,
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        {donor.bloodGroup}
      </Box>

      <CardContent sx={{ pt: 4 }}>
        {/* Name and Availability */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={600} color="#1d3557">
            {donor.fullName}
          </Typography>
          <Tooltip title={donor.isAvailable ? t.common.available : t.common.notAvailable}>
            {donor.isAvailable ? (
              <AvailableIcon sx={{ color: '#28a745' }} />
            ) : (
              <UnavailableIcon sx={{ color: '#dc3545' }} />
            )}
          </Tooltip>
        </Box>

        {/* Department */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#6c757d' }}>
          <SchoolIcon fontSize="small" />
          <Typography variant="body2">{donor.department}</Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#6c757d' }}>
          <LocationIcon fontSize="small" />
          <Typography variant="body2" noWrap>
            {donor.currentAddress}
          </Typography>
        </Box>

        {/* Gender Chip */}
        <Chip
          label={donor.gender}
          size="small"
          sx={{
            backgroundColor: 'rgba(230, 57, 70, 0.1)',
            color: '#e63946',
            fontWeight: 500,
            mb: 2,
          }}
        />

        {/* Contact Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Tooltip title="Call">
            <IconButton
              href={`tel:${donor.phone}`}
              sx={{
                backgroundColor: '#1d3557',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#457b9d',
                },
              }}
            >
              <PhoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="WhatsApp">
            <IconButton
              href={`https://wa.me/${donor.whatsapp?.replace(/\D/g, '')}`}
              target="_blank"
              sx={{
                backgroundColor: '#25D366',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#128C7E',
                },
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DonorCard;
