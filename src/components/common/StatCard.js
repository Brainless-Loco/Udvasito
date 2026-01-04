import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
const StatCard = ({ bloodGroup, count, label }) => {
  const getGradient = (group) => {
    const gradients = {
      'A+': 'linear-gradient(135deg, #e63946 0%, #ff6b6b 100%)',
      'A-': 'linear-gradient(135deg, #c1121f 0%, #e63946 100%)',
      'B+': 'linear-gradient(135deg, #457b9d 0%, #a8dadc 100%)',
      'B-': 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
      'AB+': 'linear-gradient(135deg, #2a9d8f 0%, #57cc99 100%)',
      'AB-': 'linear-gradient(135deg, #264653 0%, #2a9d8f 100%)',
      'O+': 'linear-gradient(135deg, #e9c46a 0%, #f4d35e 100%)',
      'O-': 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
    };
    return gradients[group] || gradients['A+'];
  };

  return (
    <Card
      sx={{
        background: getGradient(bloodGroup),
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.08)',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, py: 3 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {bloodGroup}
        </Typography>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ my: 1 }}
        >
          {count}
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.9 }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
