// Shared styles for About page components

export const aboutPageStyles = {
    container: {
        pt: 12,
        pb: 8,
        background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '100vh',
    },
};

export const heroSectionStyles = {
    background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
    color: 'white',
    py: { xs: 6, md: 8 },
    px: { xs: 3, md: 6 },
    borderRadius: 4,
    mb: 6,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.5,
    },
};

export const missionCardStyles = {
    height: '100%',
    p: 4,
    borderRadius: 3,
    textAlign: 'center',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    },
};

export const iconBoxStyles = (bgColor) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mx: 'auto',
    mb: 3,
    transition: 'all 0.3s ease',
});

export const factCardStyles = {
    textAlign: 'center',
    p: 3,
    borderRadius: 3,
    backgroundColor: '#fff',
    height: '100%',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0,0,0,0.05)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        borderColor: '#e63946',
    },
};

export const statBoxStyles = {
    textAlign: 'center',
    p: 3,
};

export const timelineItemStyles = {
    p: 3,
    borderRadius: 2,
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        left: -28,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: '#e63946',
        border: '3px solid #fff',
        boxShadow: '0 0 0 3px rgba(230, 57, 70, 0.2)',
    },
};

export const ctaSectionStyles = {
    mt: 6,
    p: { xs: 4, md: 6 },
    borderRadius: 4,
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
};

// Flexbox wrapper styles
export const cardWrapperStyle = {
    width: { xs: '100%', md: '33.333%' },
    p: 2,
    boxSizing: 'border-box',
};

export const factWrapperStyle = {
    width: { xs: '100%', sm: '50%', md: '25%' },
    p: 1.5,
    boxSizing: 'border-box',
};

export const statWrapperStyle = {
    width: { xs: '50%', sm: '25%' },
    p: 1,
    boxSizing: 'border-box',
};
