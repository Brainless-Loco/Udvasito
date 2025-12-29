// Shared styles for DonorRegistration components

export const textFieldStyle = {
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
};

// Responsive input wrapper style - 1/3 on lg, 1/2 on md, full on xs/sm
export const inputWrapperStyle = {
    width: { xs: '100%', sm: '100%', md: '50%', lg: '33.333%' },
    p: 1,
    boxSizing: 'border-box',
};

// Half width input wrapper for address fields - 1/2 on md+, full on xs/sm
export const inputWrapperHalfStyle = {
    width: { xs: '100%', sm: '100%', md: '50%', lg: '50%' },
    p: 1,
    boxSizing: 'border-box',
};
