import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Bloodtype as BloodIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useLanguage, useFirebase } from '../context';
import { SectionHeader, DonorCard, Loading } from '../components';
import { BLOOD_GROUPS, GENDER_OPTIONS } from '../config/constants';

const FindDonor = () => {
  const { t } = useLanguage();
  const { donors, loading, searchDonors, stats } = useFirebase();

  const [filters, setFilters] = useState({
    bloodGroup: '',
    department: '',
    address: '',
    gender: '',
    isAvailable: '',
    hasDonatedBefore: '',
  });

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
    setFilters({
      bloodGroup: '',
      department: '',
      address: '',
      gender: '',
      isAvailable: '',
      hasDonatedBefore: '',
    });
    setFilteredDonors(donors);
    setSearchPerformed(false);
  };

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <SectionHeader
          icon={SearchIcon}
          title={t.search.title}
          subtitle={t.search.subtitle}
        />

        {/* Search Filters */}
        <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label={t.search.bloodGroup}
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BloodIcon sx={{ color: '#e63946' }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">{t.search.allBloodGroups}</MenuItem>
                {BLOOD_GROUPS.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label={t.search.department}
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                placeholder={t.search.searchDepartment}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon sx={{ color: '#457b9d' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label={t.search.address}
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                placeholder={t.search.searchLocation}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon sx={{ color: '#28a745' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label={t.search.gender}
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t.search.all}</MenuItem>
                {GENDER_OPTIONS.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label={t.search.availability}
                name="isAvailable"
                value={filters.isAvailable}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t.search.all}</MenuItem>
                <MenuItem value="true">{t.search.availableNow}</MenuItem>
                <MenuItem value="false">{t.search.notAvailable}</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label={t.search.previousDonation}
                name="hasDonatedBefore"
                value={filters.hasDonatedBefore}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t.search.all}</MenuItem>
                <MenuItem value="true">{t.search.hasDonatedBefore}</MenuItem>
                <MenuItem value="false">{t.search.firstTimeDonor}</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  sx={{
                    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                    px: 4,
                  }}
                >
                  {t.search.search}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                  sx={{
                    borderColor: '#e63946',
                    color: '#e63946',
                    px: 4,
                    '&:hover': {
                      backgroundColor: 'rgba(230, 57, 70, 0.1)',
                      borderColor: '#e63946',
                    },
                  }}
                >
                  {t.search.reset}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Blood Compatibility Info */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            {t.compatibility.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="O-"
                sx={{
                  backgroundColor: '#f4a261',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              />
              <Typography variant="body2">{t.compatibility.universalDonor}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="AB+"
                sx={{
                  backgroundColor: '#2a9d8f',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              />
              <Typography variant="body2">{t.compatibility.universalRecipient}</Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
            {t.compatibility.note}
          </Typography>
        </Paper>

        {/* Results */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600} color="#1d3557">
            {t.search.donorsFound}: {filteredDonors.length}
          </Typography>
        </Box>

        {loading ? (
          <Loading />
        ) : filteredDonors.length > 0 ? (
          <Grid container spacing={3}>
            {filteredDonors.map((donor) => (
              <Grid item xs={12} sm={6} md={4} key={donor.id}>
                <DonorCard donor={donor} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: 3,
            }}
          >
            <SearchIcon sx={{ fontSize: '4rem', color: '#e9ecef', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {t.search.noDonorsFound}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t.search.tryAdjusting}
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default FindDonor;
