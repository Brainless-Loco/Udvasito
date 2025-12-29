import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    SentimentDissatisfied as SadIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { DonorCard, Loading } from '../common';
import { emptyStateStyles } from './styles';

const DonorResults = ({ donors, loading, searchPerformed }) => {
    const { t } = useLanguage();

    if (loading) {
        return <Loading />;
    }

    return (
        <Box>
            {/* Results Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" fontWeight={600} color="#1d3557">
                        {t.search.donorsFound}
                    </Typography>
                    <Chip
                        label={donors.length}
                        sx={{
                            bgcolor: donors.length > 0 ? '#e8f5e9' : '#ffebee',
                            color: donors.length > 0 ? '#28a745' : '#e63946',
                            fontWeight: 700,
                            fontSize: '1rem',
                        }}
                    />
                </Box>
                {searchPerformed && (
                    <Typography variant="body2" color="text.secondary">
                        {t.search.searchResults || 'Showing filtered results'}
                    </Typography>
                )}
            </Box>

            {/* Results Grid or Empty State */}
            {donors.length > 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        mx: -1.5,
                    }}
                >
                    {donors.map((donor) => (
                        <Box
                            key={donor.id}
                            sx={{
                                width: { xs: '100%', sm: '50%', md: '33.333%' },
                                p: 1.5,
                                boxSizing: 'border-box',
                            }}
                        >
                            <DonorCard donor={donor} />
                        </Box>
                    ))}
                </Box>
            ) : (
                <Paper sx={emptyStateStyles}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                        }}
                    >
                        {searchPerformed ? (
                            <SadIcon sx={{ fontSize: 40, color: '#dee2e6' }} />
                        ) : (
                            <SearchIcon sx={{ fontSize: 40, color: '#dee2e6' }} />
                        )}
                    </Box>
                    <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={600}>
                        {searchPerformed ? t.search.noDonorsFound : (t.search.startSearching || 'Start Searching')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                        {searchPerformed
                            ? t.search.tryAdjusting
                            : (t.search.useFilters || 'Use the filters above to find blood donors in your area')}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default DonorResults;
