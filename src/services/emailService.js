import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const DONOR_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_DONOR;
const VOLUNTEER_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_VOLUNTEER;

/**
 * Send welcome email to newly registered donor
 * @param {Object} donorData - The donor's registration data
 * @returns {Promise} - EmailJS response
 */
export const sendDonorWelcomeEmail = async (donorData) => {
  try {
    const templateParams = {
      to_name: donorData.fullName,
      to_email: donorData.email,
      blood_group: donorData.bloodGroup,
      phone: donorData.phone,
      institution: donorData.institution,
      department: donorData.department,
      registration_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    const response = await emailjs.send(
      SERVICE_ID,
      DONOR_TEMPLATE_ID,
      templateParams
    );

    console.log('Donor welcome email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending donor welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email to newly registered volunteer
 * @param {Object} volunteerData - The volunteer's registration data
 * @returns {Promise} - EmailJS response
 */
export const sendVolunteerWelcomeEmail = async (volunteerData) => {
  try {
    const templateParams = {
      to_name: volunteerData.fullName,
      to_email: volunteerData.email,
      phone: volunteerData.phone,
      institution: volunteerData.institution,
      department: volunteerData.department,
      registration_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    const response = await emailjs.send(
      SERVICE_ID,
      VOLUNTEER_TEMPLATE_ID,
      templateParams
    );

    console.log('Volunteer welcome email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending volunteer welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a generic email
 * @param {string} templateId - The EmailJS template ID
 * @param {Object} params - Template parameters
 * @returns {Promise} - EmailJS response
 */
export const sendEmail = async (templateId, params) => {
  try {
    const response = await emailjs.send(SERVICE_ID, templateId, params);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const emailService = {
  sendDonorWelcomeEmail,
  sendVolunteerWelcomeEmail,
  sendEmail,
};

export default emailService;
