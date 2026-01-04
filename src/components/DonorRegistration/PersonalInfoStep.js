import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    WhatsApp as WhatsAppIcon,
    Bloodtype as BloodtypeIcon,
    Cake as CakeIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { BLOOD_GROUPS, GENDER_OPTIONS } from '../../config/constants';
import { textFieldStyle, inputWrapperStyle } from './styles';

const PersonalInfoStep = ({ formData, handleChange }) => {
    const { t } = useLanguage();

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#e63946', width: 32, height: 32 }}>
                    <PersonIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" fontWeight={600} color="#1d3557">
                    Personal Information
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        required
                        label={t.form.fullName}
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        required
                        type="email"
                        label={t.form.email}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        required
                        label={t.form.phone}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        label={t.form.whatsapp}
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <WhatsAppIcon sx={{ color: '#25D366' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        required
                        select
                        label={t.form.bloodGroup}
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BloodtypeIcon sx={{ color: '#e63946' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    >
                        <MenuItem value="" disabled>
                            {t.form.selectBloodGroup}
                        </MenuItem>
                        {BLOOD_GROUPS.map((group) => (
                            <MenuItem key={group} value={group}>
                                <Chip
                                    label={group}
                                    size="small"
                                    sx={{ bgcolor: '#fee2e2', color: '#e63946', fontWeight: 600 }}
                                />
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        required
                        label={t.form.dateOfBirth}
                        name="dateOfBirth"
                        placeholder="DD/MM/YYYY"
                        value={formData.dateOfBirth}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers and slashes
                            const filtered = value.replace(/[^\d/]/g, '');
                            
                            // Auto-format DD/MM/YYYY
                            let formatted = filtered;
                            if (filtered.length === 2 && !filtered.includes('/')) {
                                formatted = filtered + '/';
                            } else if (filtered.length === 5 && (filtered.match(/\//g) || []).length === 1) {
                                formatted = filtered + '/';
                            }
                            
                            // Call original handler with formatted value
                            handleChange({
                                target: { name: 'dateOfBirth', value: formatted }
                            });
                        }}
                        helperText="Format: DD/MM/YYYY (e.g., 25/12/1995)"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CakeIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                            maxLength: 10,
                        }}
                        sx={textFieldStyle}
                    />
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        required
                        select
                        label={t.form.gender}
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    >
                        <MenuItem value="" disabled>
                            {t.form.selectGender}
                        </MenuItem>
                        {GENDER_OPTIONS.map((gender) => (
                            <MenuItem key={gender} value={gender}>
                                {gender}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>
        </Box>
    );
};

export default PersonalInfoStep;
