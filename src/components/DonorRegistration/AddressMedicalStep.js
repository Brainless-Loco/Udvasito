import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {
    Home as HomeIcon,
    MedicalServices as MedicalIcon,
    ContactPhone as EmergencyIcon,
    CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { textFieldStyle, inputWrapperStyle, inputWrapperHalfStyle } from './styles';

const AddressMedicalStep = ({ formData, handleChange }) => {
    const { t } = useLanguage();

    return (
        <Box>
            {/* Address Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#2a9d8f', width: 32, height: 32 }}>
                    <HomeIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" fontWeight={600} color="#1d3557">
                    Address Information
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                <Box sx={inputWrapperHalfStyle}>
                    <TextField
                        fullWidth
                        required
                        multiline
                        rows={2}
                        label={t.form.currentAddress}
                        name="currentAddress"
                        value={formData.currentAddress}
                        onChange={handleChange}
                        sx={textFieldStyle}
                    />
                </Box>

                <Box sx={inputWrapperHalfStyle}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={t.form.permanentAddress}
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleChange}
                        sx={textFieldStyle}
                    />
                </Box>
            </Box>

            {/* Medical Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, mt: 4 }}>
                <Avatar sx={{ bgcolor: '#e63946', width: 32, height: 32 }}>
                    <MedicalIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" fontWeight={600} color="#1d3557">
                    Donation & Medical Information
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                <Box sx={inputWrapperStyle}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa', height: '100%' }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" sx={{ fontWeight: 500, color: '#1d3557' }}>
                                {t.form.hasDonatedBefore}
                            </FormLabel>
                            <RadioGroup
                                row
                                name="hasDonatedBefore"
                                value={formData.hasDonatedBefore}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={<Radio sx={{ '&.Mui-checked': { color: '#e63946' } }} />}
                                    label={t.form.yes}
                                />
                                <FormControlLabel
                                    value="no"
                                    control={<Radio sx={{ '&.Mui-checked': { color: '#e63946' } }} />}
                                    label={t.form.no}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Box>

                {formData.hasDonatedBefore === 'yes' && (
                    <Box sx={inputWrapperStyle}>
                        <TextField
                            fullWidth
                            type="date"
                            label={t.form.lastDonationDate}
                            name="lastDonationDate"
                            value={formData.lastDonationDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
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
                )}

                <Box sx={inputWrapperStyle}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa', height: '100%' }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" sx={{ fontWeight: 500, color: '#1d3557' }}>
                                {t.form.isAvailable}
                            </FormLabel>
                            <RadioGroup
                                row
                                name="isAvailable"
                                value={formData.isAvailable}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={<Radio sx={{ '&.Mui-checked': { color: '#28a745' } }} />}
                                    label={t.form.yes}
                                />
                                <FormControlLabel
                                    value="no"
                                    control={<Radio sx={{ '&.Mui-checked': { color: '#e63946' } }} />}
                                    label={t.form.no}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        label={t.form.medicalConditions}
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleChange}
                        placeholder="Leave blank if none"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MedicalIcon sx={{ color: '#1d3557' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Box>

                <Box sx={inputWrapperStyle}>
                    <TextField
                        fullWidth
                        label={t.form.emergencyContact}
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmergencyIcon sx={{ color: '#e63946' }} />
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

export default AddressMedicalStep;
