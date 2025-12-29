 import React, { useState } from 'react';
import {
    Box,
    Paper,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useLanguage, useFirebase } from '../../context';
import { sendDonorWelcomeEmail } from '../../services/emailService';
import { 
    SectionHeader,
    BenefitsSidebar,
    PersonalInfoStep,
    InstitutionStep,
    AddressMedicalStep,
    NavigationButtons,
} from '../../components';

const INITIAL_FORM_DATA = {
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
};

const STEPS = ['Personal Info', 'Institution', 'Address & Medical'];

const DonorRegistration = () => {
    const { t } = useLanguage();
    const { addDonor } = useFirebase();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
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

            const result = await addDonor(donorData);

            if (result.success) {
                sendDonorWelcomeEmail(donorData);

                await Swal.fire({
                    icon: 'success',
                    title: '🎉 Welcome to the Donor Family!',
                    html: `
                        <div style="text-align: center;">
                            <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
                                ${t.registration.successMessage}
                            </p>
                            <div style="background: linear-gradient(135deg, #e63946 0%, #c1121f 100%); color: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
                                <p style="margin: 0; font-size: 14px;">Your blood type</p>
                                <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold;">${formData.bloodGroup}</p>
                            </div>
                        </div>
                    `,
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#1d3557',
                });

                setFormData(INITIAL_FORM_DATA);
                setActiveStep(0);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.message || 'Something went wrong. Please try again.',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#e63946',
            });
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <PersonalInfoStep formData={formData} handleChange={handleChange} />;
            case 1:
                return <InstitutionStep formData={formData} handleChange={handleChange} />;
            case 2:
                return <AddressMedicalStep formData={formData} handleChange={handleChange} />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ pt: 12, pb: 8, px:2, background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
            <Box maxWidth="xl">
                <SectionHeader
                    icon={PersonAddIcon}
                    title={t.registration.donorTitle}
                    subtitle={t.registration.donorSubtitle}
                />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Benefits Section */}
                    <BenefitsSidebar />

                    {/* Registration Form */}
                    <Box sx={{ width: { xs: '100%', md: '75%' }, flexGrow: 1 }}>
                        <Paper
                            sx={{
                                p: { xs: 2, sm: 3, md: 4 },
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            }}
                        >
                            {/* Stepper */}
                            <Stepper
                                activeStep={activeStep}
                                alternativeLabel
                                sx={{
                                    mb: 4,
                                    '& .MuiStepLabel-root .Mui-completed': { color: '#28a745' },
                                    '& .MuiStepLabel-root .Mui-active': { color: '#e63946' },
                                }}
                            >
                                {STEPS.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <form onSubmit={handleSubmit}>
                                {renderStepContent()}

                                <NavigationButtons
                                    activeStep={activeStep}
                                    totalSteps={STEPS.length}
                                    onBack={handleBack}
                                    onNext={handleNext}
                                    loading={loading}
                                />
                            </form>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DonorRegistration;
