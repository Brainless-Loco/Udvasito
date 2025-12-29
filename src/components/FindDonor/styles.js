// Shared styles for FindDonor components

export const pageStyles = {
    container: {
        pt: 12,
        pb: 8,
        background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '100vh',
    },
};

export const filterPaperStyles = {
    p: { xs: 2, sm: 3, md: 4 },
    borderRadius: 3,
    mb: 4,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
};

export const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: '#fff',
        '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1d3557',
            },
        },
        '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e63946',
            },
        },
    },
};

export const searchButtonStyles = {
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    px: 4,
    py: 1.5,
    borderRadius: 2,
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(230, 57, 70, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #c1121f 0%, #a00d1a 100%)',
        boxShadow: '0 6px 20px rgba(230, 57, 70, 0.4)',
    },
};

export const resetButtonStyles = {
    borderColor: '#1d3557',
    color: '#1d3557',
    px: 4,
    py: 1.5,
    borderRadius: 2,
    fontWeight: 600,
    '&:hover': {
        backgroundColor: 'rgba(29, 53, 87, 0.04)',
        borderColor: '#1d3557',
    },
};

export const compatibilityPaperStyles = {
    p: 3,
    borderRadius: 3,
    mb: 4,
    background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(29, 53, 87, 0.3)',
};

export const statsCardStyles = {
    p: 2,
    borderRadius: 2,
    textAlign: 'center',
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    },
};

export const emptyStateStyles = {
    textAlign: 'center',
    py: 8,
    borderRadius: 3,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
};

// Input wrapper styles for responsive layout
export const filterInputWrapperStyle = {
    width: { xs: '100%', sm: '50%', md: '33.333%' },
    p: 1,
    boxSizing: 'border-box',
};

export const filterInputHalfStyle = {
    width: { xs: '100%', sm: '50%' },
    p: 1,
    boxSizing: 'border-box',
};
