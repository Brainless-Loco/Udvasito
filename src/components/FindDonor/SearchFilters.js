import React from 'react';
import {
    Box,
    Paper,
    TextField,
    MenuItem,
    Button,
    Typography,
    InputAdornment,
    Avatar,
    Collapse,
    IconButton,
} from '@mui/material';
import {
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Bloodtype as BloodIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    FilterList as FilterIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { BLOOD_GROUPS, GENDER_OPTIONS } from '../../config/constants';
import {
    filterPaperStyles,
    textFieldStyles,
    searchButtonStyles,
    resetButtonStyles,
    filterInputWrapperStyle,
} from './styles';

const SearchFilters = ({
    filters,
    onFilterChange,
    onSearch,
    onReset,
    expanded = true,
    onToggleExpand,
}) => {
    const { t } = useLanguage();

    return (
        <Paper sx={filterPaperStyles}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: expanded ? 3 : 0,
                    cursor: onToggleExpand ? 'pointer' : 'default',
                }}
                onClick={onToggleExpand}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#e63946', width: 40, height: 40 }}>
                        <FilterIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={600} color="#1d3557">
                            {t.search.filterTitle || 'Search Filters'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t.search.filterSubtitle || 'Find the perfect match'}
                        </Typography>
                    </Box>
                </Box>
                {onToggleExpand && (
                    <IconButton>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                )}
            </Box>

            <Collapse in={expanded}>
                {/* Filter Fields */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                    {/* Blood Group */}
                    <Box sx={filterInputWrapperStyle}>
                        <TextField
                            fullWidth
                            select
                            label={t.search.bloodGroup}
                            name="bloodGroup"
                            value={filters.bloodGroup}
                            onChange={onFilterChange}
                            sx={textFieldStyles}
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
                    </Box>

                    {/* Department */}
                    <Box sx={filterInputWrapperStyle}>
                        <TextField
                            fullWidth
                            label={t.search.department}
                            name="department"
                            value={filters.department}
                            onChange={onFilterChange}
                            placeholder={t.search.searchDepartment}
                            sx={textFieldStyles}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SchoolIcon sx={{ color: '#457b9d' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Address */}
                    <Box sx={filterInputWrapperStyle}>
                        <TextField
                            fullWidth
                            label={t.search.address}
                            name="address"
                            value={filters.address}
                            onChange={onFilterChange}
                            placeholder={t.search.searchLocation}
                            sx={textFieldStyles}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationIcon sx={{ color: '#28a745' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Gender */}
                    <Box sx={filterInputWrapperStyle}>
                        <TextField
                            fullWidth
                            select
                            label={t.search.gender}
                            name="gender"
                            value={filters.gender}
                            onChange={onFilterChange}
                            sx={textFieldStyles}
                        >
                            <MenuItem value="">{t.search.all}</MenuItem>
                            {GENDER_OPTIONS.map((gender) => (
                                <MenuItem key={gender} value={gender}>
                                    {gender}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* Availability */}
                    <Box sx={filterInputWrapperStyle}>
                        <TextField
                            fullWidth
                            select
                            label={t.search.availability}
                            name="isAvailable"
                            value={filters.isAvailable}
                            onChange={onFilterChange}
                            sx={textFieldStyles}
                        >
                            <MenuItem value="">{t.search.all}</MenuItem>
                            <MenuItem value="true">{t.search.availableNow}</MenuItem>
                            <MenuItem value="false">{t.search.notAvailable}</MenuItem>
                        </TextField>
                    </Box>

                    {/* Previous Donation */}
                    <Box sx={filterInputWrapperStyle}>
                        <TextField
                            fullWidth
                            select
                            label={t.search.previousDonation}
                            name="hasDonatedBefore"
                            value={filters.hasDonatedBefore}
                            onChange={onFilterChange}
                            sx={textFieldStyles}
                        >
                            <MenuItem value="">{t.search.all}</MenuItem>
                            <MenuItem value="true">{t.search.hasDonatedBefore}</MenuItem>
                            <MenuItem value="false">{t.search.firstTimeDonor}</MenuItem>
                        </TextField>
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3, pt: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={onSearch}
                        sx={searchButtonStyles}
                    >
                        {t.search.search}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={onReset}
                        sx={resetButtonStyles}
                    >
                        {t.search.reset}
                    </Button>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default SearchFilters;
