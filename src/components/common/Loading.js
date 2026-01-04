import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useLanguage } from '../../context';

const Loading = ({ message }) => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        gap: 2,
      }}
    >
      <CircularProgress
        size={50}
        sx={{
          color: '#e63946',
        }}
      />
      <Typography variant="body1" color="text.secondary">
        {message || t.common.loading}
      </Typography>
    </Box>
  );
};

export default Loading;
