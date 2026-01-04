import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const SectionHeader = ({ icon: Icon, title, subtitle, light = false }) => {
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="h3"
        fontWeight={700}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          color: light ? 'white' : '#1d3557',
          mb: 2,
        }}
      >
        {Icon && <Icon sx={{ color: light ? 'white' : '#e63946', fontSize: '2.5rem' }} />}
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="h6"
          sx={{
            color: light ? 'rgba(255,255,255,0.8)' : '#6c757d',
            fontWeight: 400,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeader;
