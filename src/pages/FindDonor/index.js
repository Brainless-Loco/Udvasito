import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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
        // When searching, show all results without limit
        const results = searchDonors(filters, false);
        setFilteredDonors(results);
        setSearchPerformed(true);
    };

    const handleReset = () => {
        setFilters(INITIAL_FILTERS);
        // When resetting, apply the 5-per-blood-group limit
        const limitedDonors = searchDonors(INITIAL_FILTERS, true);
        setFilteredDonors(limitedDonors);
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

                {/* Results */}
                <DonorResults
                    donors={filteredDonors}
                    loading={loading}
                    searchPerformed={searchPerformed}
                />

                {/* Blood Compatibility Info */}
                <BloodCompatibilityBanner />
            </Container>
        </Box>
    );
};

export default FindDonor;
