import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Favorite as HeartIcon,
  LocalHospital as HospitalIcon,
  SentimentSatisfied as HappyIcon,
  Replay as ReplayIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useLanguage, useFirebase } from '../context';
import { sendDonorWelcomeEmail } from '../services/emailService';
import { SectionHeader } from '../components';
import { BLOOD_GROUPS, GENDER_OPTIONS, INSTITUTIONS, DEPARTMENTS_CU } from '../config/constants';

const DonorRegistration = () => {
  const { t } = useLanguage();
  const { addDonor } = useFirebase();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: '',
    institution: '',
    otherInstitution: '',
    department: '',
    otherDepartment: '',
    studentId: '',
    session: '',
    currentAddress: '',
    permanentAddress: '',
    hasDonatedBefore: 'no',
    lastDonationDate: '',
    isAvailable: 'yes',
    medicalConditions: '',
    emergencyContact: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const donorData = {
        ...formData,
        institution: formData.institution === 'Other' ? formData.otherInstitution : formData.institution,
        department: formData.department === 'Other' ? formData.otherDepartment : formData.department,
        hasDonatedBefore: formData.hasDonatedBefore === 'yes',
        isAvailable: formData.isAvailable === 'yes',
      };

      // Add donor to Firebase
      const result = await addDonor(donorData);

      if (result.success) {
        // Send welcome email in background
        sendDonorWelcomeEmail(donorData);

        setSnackbar({
          open: true,
          message: t.registration.successMessage,
          severity: 'success',
        });

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          whatsapp: '',
          bloodGroup: '',
          dateOfBirth: '',
          gender: '',
          institution: '',
          otherInstitution: '',
          department: '',
          otherDepartment: '',
          studentId: '',
          session: '',
          currentAddress: '',
          permanentAddress: '',
          hasDonatedBefore: 'no',
          lastDonationDate: '',
          isAvailable: 'yes',
          medicalConditions: '',
          emergencyContact: '',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Registration failed. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <HeartIcon />, text: t.registration.benefit1 },
    { icon: <HospitalIcon />, text: t.registration.benefit2 },
    { icon: <HappyIcon />, text: t.registration.benefit3 },
    { icon: <ReplayIcon />, text: t.registration.benefit4 },
  ];

  const eligibility = [
    t.registration.ageRange,
    t.registration.minWeight,
    t.registration.minHemoglobin,
    t.registration.goodHealth,
    t.registration.noRecentSurgeries,
  ];

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <SectionHeader
          icon={PersonAddIcon}
          title={t.registration.donorTitle}
          subtitle={t.registration.donorSubtitle}
        />

        <Grid container spacing={4}>
          {/* Benefits Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t.registration.whyBecomeDonor}
              </Typography>
              <List>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ color: '#e63946', minWidth: 40 }}>
                      {benefit.icon}
                    </ListItemIcon>
                    <ListItemText primary={benefit.text} />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon sx={{ color: '#28a745' }} />
                  {t.registration.eligibility}
                </Typography>
                <List dense>
                  {eligibility.map((criteria, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={criteria}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          </Grid>

          {/* Registration Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Personal Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} color="#1d3557" gutterBottom>
                      Personal Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label={t.form.fullName}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label={t.form.email}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label={t.form.phone}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t.form.whatsapp}
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      select
                      label={t.form.bloodGroup}
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                    >
                      <MenuItem value="" disabled>
                        {t.form.selectBloodGroup}
                      </MenuItem>
                      {BLOOD_GROUPS.map((group) => (
                        <MenuItem key={group} value={group}>
                          {group}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      label={t.form.dateOfBirth}
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      select
                      label={t.form.gender}
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
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
                  </Grid>

                  {/* Institution Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} color="#1d3557" gutterBottom sx={{ mt: 2 }}>
                      Institution Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      select
                      label={t.form.institution}
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
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
                  </Grid>

                  {formData.institution === 'Other' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label={t.form.otherInstitution}
                        name="otherInstitution"
                        value={formData.otherInstitution}
                        onChange={handleChange}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      select
                      label={t.form.department}
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
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
                  </Grid>

                  {formData.department === 'Other' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label={t.form.otherDepartment}
                        name="otherDepartment"
                        value={formData.otherDepartment}
                        onChange={handleChange}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t.form.studentId}
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t.form.session}
                      name="session"
                      value={formData.session}
                      onChange={handleChange}
                      placeholder="e.g., 2020-21"
                    />
                  </Grid>

                  {/* Address Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} color="#1d3557" gutterBottom sx={{ mt: 2 }}>
                      Address Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={2}
                      label={t.form.currentAddress}
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label={t.form.permanentAddress}
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Donation History */}
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} color="#1d3557" gutterBottom sx={{ mt: 2 }}>
                      Donation Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t.form.hasDonatedBefore}</FormLabel>
                      <RadioGroup
                        row
                        name="hasDonatedBefore"
                        value={formData.hasDonatedBefore}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label={t.form.yes} />
                        <FormControlLabel value="no" control={<Radio />} label={t.form.no} />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {formData.hasDonatedBefore === 'yes' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label={t.form.lastDonationDate}
                        name="lastDonationDate"
                        value={formData.lastDonationDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t.form.isAvailable}</FormLabel>
                      <RadioGroup
                        row
                        name="isAvailable"
                        value={formData.isAvailable}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label={t.form.yes} />
                        <FormControlLabel value="no" control={<Radio />} label={t.form.no} />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t.form.medicalConditions}
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      placeholder="Leave blank if none"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t.form.emergencyContact}
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t.registration.submit
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DonorRegistration;
