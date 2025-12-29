import React from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Typography,
    InputAdornment,
    Avatar,
} from '@mui/material';
import {
    School as SchoolIcon,
    Badge as BadgeIcon,
    CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { INSTITUTIONS, DEPARTMENTS_CU } from '../../config/constants';
import { textFieldStyle, inputWrapperStyle } from './styles';

const InstitutionStep = ({ formData, handleChange }) => {
    const { t } = useLanguage();

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#457b9d', width: 32, height: 32 }}>
                    <SchoolIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" fontWeight={600} color="#1d3557">
                    Institution Information
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        required
                        select
                        label={t.form.institution}
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SchoolIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    >
                        <MenuItem value="" disabled>
                            {t.form.selectInstitution}
                        </MenuItem>
                        {INSTITUTIONS.map((inst) => (
                            <MenuItem key={inst} value={inst}>
                                {inst}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {formData.institution === 'Other' && (
                    <Box sx={inputWrapperStyle}>
                        <TextField
                            fullWidth
                            required
                            label={t.form.otherInstitution}
                            name="otherInstitution"
                            value={formData.otherInstitution}
                            onChange={handleChange}
                            sx={textFieldStyle}
                        />
                    </Box>
                )}

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        required
                        select
                        label={t.form.department}
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BadgeIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    >
                        <MenuItem value="" disabled>
                            {t.form.selectDepartment}
                        </MenuItem>
                        {DEPARTMENTS_CU.map((dept) => (
                            <MenuItem key={dept} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {formData.department === 'Other' && (
                    <Box sx={inputWrapperStyle}>
                        <TextField
                            fullWidth
                            required
                            label={t.form.otherDepartment}
                            name="otherDepartment"
                            value={formData.otherDepartment}
                            onChange={handleChange}
                            sx={textFieldStyle}
                        />
                    </Box>
                )}

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        label={t.form.studentId}
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BadgeIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        label={t.form.session}
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        placeholder="e.g., 2020-21"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default InstitutionStep;
