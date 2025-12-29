import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useLanguage, useFirebase } from '../../context';
import {
    SectionHeader,
    SearchFilters,
    BloodCompatibilityBanner,
    DonorResults,
    StatsOverview,
} from '../../components';
import { pageStyles } from '../../components/FindDonor/styles';

const INITIAL_FILTERS = {
    bloodGroup: '',
    department: '',
    address: '',
    gender: '',
    isAvailable: '',
    hasDonatedBefore: '',
};

const FindDonor = () => {
    const { t } = useLanguage();
    const { donors, loading, searchDonors, stats } = useFirebase();

    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [filteredDonors, setFilteredDonors] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        setFilteredDonors(donors);
    }, [donors]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        const results = searchDonors(filters);
        setFilteredDonors(results);
        setSearchPerformed(true);
    };

    const handleReset = () => {
        setFilters(INITIAL_FILTERS);
        setFilteredDonors(donors);
        setSearchPerformed(false);
    };

    return (
        <Box sx={pageStyles.container}>
            <Container maxWidth="lg">
                <SectionHeader
                    icon={SearchIcon}
                    title={t.search.title}
                    subtitle={t.search.subtitle}
                />

                {/* Stats Overview */}
                <StatsOverview stats={stats} totalDonors={donors.length} />

                {/* Search Filters */}
                <SearchFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    onReset={handleReset}
                />

                {/* Blood Compatibility Info */}
                <BloodCompatibilityBanner />

                {/* Results */}
                <DonorResults
                    donors={filteredDonors}
                    loading={loading}
                    searchPerformed={searchPerformed}
                />
            </Container>
        </Box>
    );
};

export default FindDonor;
