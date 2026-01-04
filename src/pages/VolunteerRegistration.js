import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import {
  VolunteerActivism as VolunteerIcon,
} from '@mui/icons-material';
import { useLanguage, useFirebase } from '../context';
import { sendVolunteerWelcomeEmail } from '../services/emailService';
import { SectionHeader } from '../components';
import { GENDER_OPTIONS, INSTITUTIONS, DEPARTMENTS_CU } from '../config/constants';
import UnderDevelopment from './UnderDevelopment';

const VolunteerRegistration = () => {
  const { t } = useLanguage();
  const { addVolunteer } = useFirebase();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
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
    skills: '',
    motivation: '',
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
      const volunteerData = {
        ...formData,
        institution: formData.institution === 'Other' ? formData.otherInstitution : formData.institution,
        department: formData.department === 'Other' ? formData.otherDepartment : formData.department,
      };

      // Add volunteer to Firebase
      const result = await addVolunteer(volunteerData);

      if (result.success) {
        // Send welcome email in background
        sendVolunteerWelcomeEmail(volunteerData);

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
          skills: '',
          motivation: '',
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

  return (
    // <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
    //   <Container maxWidth="md">
    //     <SectionHeader
    //       icon={VolunteerIcon}
    //       title={t.registration.volunteerTitle}
    //       subtitle={t.registration.volunteerSubtitle}
    //     />

    //     <Paper sx={{ p: 4, borderRadius: 3 }}>
    //       <form onSubmit={handleSubmit}>
    //         <Grid container spacing={3}>
    //           {/* Personal Information */}
    //           <Grid item xs={12}>
    //             <Typography variant="h6" fontWeight={600} color="#1d3557" gutterBottom>
    //               Personal Information
    //             </Typography>
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               required
    //               label={t.form.fullName}
    //               name="fullName"
    //               value={formData.fullName}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               required
    //               type="email"
    //               label={t.form.email}
    //               name="email"
    //               value={formData.email}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               required
    //               label={t.form.phone}
    //               name="phone"
    //               value={formData.phone}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               label={t.form.whatsapp}
    //               name="whatsapp"
    //               value={formData.whatsapp}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               required
    //               type="date"
    //               label={t.form.dateOfBirth}
    //               name="dateOfBirth"
    //               value={formData.dateOfBirth}
    //               onChange={handleChange}
    //               InputLabelProps={{ shrink: true }}
    //             />
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               required
    //               select
    //               label={t.form.gender}
    //               name="gender"
    //               value={formData.gender}
    //               onChange={handleChange}
    //             >
    //               <MenuItem value="" disabled>
    //                 {t.form.selectGender}
    //               </MenuItem>
    //               {GENDER_OPTIONS.map((gender) => (
    //                 <MenuItem key={gender} value={gender}>
    //                   {gender}
    //                 </MenuItem>
    //               ))}
    //             </TextField>
    //           </Grid>

    //           {/* Institution Information */}
    //           <Grid item xs={12}>
    //             <Typography variant="h6" fontWeight={600} color="#1d3557" gutterBottom sx={{ mt: 2 }}>
    //               Institution Information
    //             </Typography>
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               required
    //               select
    //               label={t.form.institution}
    //               name="institution"
    //               value={formData.institution}
    //               onChange={handleChange}
    //             >
    //               <MenuItem value="" disabled>
    //                 {t.form.selectInstitution}
    //               </MenuItem>
    //               {INSTITUTIONS.map((inst) => (
    //                 <MenuItem key={inst} value={inst}>
    //                   {inst}
    //                 </MenuItem>
    //               ))}
    //             </TextField>
    //           </Grid>

    //           {formData.institution === 'Other' && (
    //             <Grid item xs={12} sm={6}>
    //               <TextField
    //                 fullWidth
    //                 required
    //                 label={t.form.otherInstitution}
    //                 name="otherInstitution"
    //                 value={formData.otherInstitution}
    //                 onChange={handleChange}
    //               />
    //             </Grid>
    //           )}

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               required
    //               select
    //               label={t.form.department}
    //               name="department"
    //               value={formData.department}
    //               onChange={handleChange}
    //             >
    //               <MenuItem value="" disabled>
    //                 {t.form.selectDepartment}
    //               </MenuItem>
    //               {DEPARTMENTS_CU.map((dept) => (
    //                 <MenuItem key={dept} value={dept}>
    //                   {dept}
    //                 </MenuItem>
    //               ))}
    //             </TextField>
    //           </Grid>

    //           {formData.department === 'Other' && (
    //             <Grid item xs={12} sm={6}>
    //               <TextField
    //                 fullWidth
    //                 required
    //                 label={t.form.otherDepartment}
    //                 name="otherDepartment"
    //                 value={formData.otherDepartment}
    //                 onChange={handleChange}
    //               />
    //             </Grid>
    //           )}

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               label={t.form.studentId}
    //               name="studentId"
    //               value={formData.studentId}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               label={t.form.session}
    //               name="session"
    //               value={formData.session}
    //               onChange={handleChange}
    //               placeholder="e.g., 2020-21"
    //             />
    //           </Grid>

    //           {/* Address Information */}
    //           <Grid item xs={12}>
    //             <Typography variant="h6" fontWeight={600} color="#1d3557" gutterBottom sx={{ mt: 2 }}>
    //               Address Information
    //             </Typography>
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               required
    //               multiline
    //               rows={2}
    //               label={t.form.currentAddress}
    //               name="currentAddress"
    //               value={formData.currentAddress}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               multiline
    //               rows={2}
    //               label={t.form.permanentAddress}
    //               name="permanentAddress"
    //               value={formData.permanentAddress}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           {/* Additional Information */}
    //           <Grid item xs={12}>
    //             <Typography variant="h6" fontWeight={600} color="#1d3557" gutterBottom sx={{ mt: 2 }}>
    //               Additional Information
    //             </Typography>
    //           </Grid>

    //           <Grid item xs={12}>
    //             <TextField
    //               fullWidth
    //               multiline
    //               rows={3}
    //               label="Skills & Expertise"
    //               name="skills"
    //               value={formData.skills}
    //               onChange={handleChange}
    //               placeholder="e.g., Event management, Social media, First aid, etc."
    //             />
    //           </Grid>

    //           <Grid item xs={12}>
    //             <TextField
    //               fullWidth
    //               multiline
    //               rows={3}
    //               label="Why do you want to volunteer?"
    //               name="motivation"
    //               value={formData.motivation}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               fullWidth
    //               label={t.form.emergencyContact}
    //               name="emergencyContact"
    //               value={formData.emergencyContact}
    //               onChange={handleChange}
    //             />
    //           </Grid>

    //           {/* Submit Button */}
    //           <Grid item xs={12}>
    //             <Button
    //               type="submit"
    //               variant="contained"
    //               size="large"
    //               fullWidth
    //               disabled={loading}
    //               sx={{
    //                 mt: 2,
    //                 py: 1.5,
    //                 background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
    //               }}
    //             >
    //               {loading ? (
    //                 <CircularProgress size={24} color="inherit" />
    //               ) : (
    //                 t.registration.submit
    //               )}
    //             </Button>
    //           </Grid>
    //         </Grid>
    //       </form>
    //     </Paper>
    //   </Container>

    //   <Snackbar
    //     open={snackbar.open}
    //     autoHideDuration={6000}
    //     onClose={() => setSnackbar({ ...snackbar, open: false })}
    //     anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    //   >
    //     <Alert
    //       onClose={() => setSnackbar({ ...snackbar, open: false })}
    //       severity={snackbar.severity}
    //       sx={{ width: '100%' }}
    //     >
    //       {snackbar.message}
    //     </Alert>
    //   </Snackbar>
    // </Box>
  <UnderDevelopment/>
  );
};

export default VolunteerRegistration;
