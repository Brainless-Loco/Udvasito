import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useLanguage } from '../../context';

const NavigationButtons = ({ 
    activeStep, 
    totalSteps, 
    onBack, 
    onNext, 
    loading,
    isStepValid = true
}) => {
    const { t } = useLanguage();
    const isLastStep = activeStep === totalSteps - 1;

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4, 
                pt: 3, 
                borderTop: '1px solid rgba(0,0,0,0.1)' 
            }}
        >
            <Button
                disabled={activeStep === 0}
                onClick={onBack}
                variant="outlined"
                sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: '#1d3557',
                    color: '#1d3557',
                    '&:hover': {
                        borderColor: '#1d3557',
                        bgcolor: 'rgba(29, 53, 87, 0.04)',
                    },
                }}
            >
                Back
            </Button>

            {isLastStep ? (
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !isStepValid}
                    sx={{
                        px: 6,
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: '0 4px 15px rgba(230, 57, 70, 0.3)',
                        '&:hover:not(:disabled)': {
                            background: 'linear-gradient(135deg, #c1121f 0%, #a00d1a 100%)',
                            boxShadow: '0 6px 20px rgba(230, 57, 70, 0.4)',
                        },
                        '&:disabled': {
                            opacity: 0.6,
                        },
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t.registration.submit
                    )}
                </Button>
            ) : (
                <Button
                    onClick={onNext}
                    disabled={!isStepValid}
                    variant="contained"
                    sx={{
                        px: 6,
                        py: 1.5,
                        borderRadius: 2,
                        bgcolor: '#1d3557',
                        fontWeight: 600,
                        '&:hover:not(:disabled)': {
                            bgcolor: '#152536',
                        },
                        '&:disabled': {
                            opacity: 0.6,
                        },
                    }}
                >
                    Next
                </Button>
            )}
        </Box>
    );
};

export default NavigationButtons;
