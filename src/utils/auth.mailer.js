import axios from 'axios';

const MAIL_SERVICE_URL = process.env.MAIL_SERVICE_URL || 'http://localhost:8024/send';

/**
 * Send an email via the Go microservice
 * @param {string|string[]} to - recipient(s)
 * @param {string} subject
 * @param {string} body - HTML body
 * @param {Object} options - additional options (cc, priority, attachments)
 */
export default async function sendMail(
  to,
  subject,
  body,
  options = {}
) {
  const {
    cc = [],
    priority = 'medium',
    attachments = []
  } = options;

  // Ensure arrays for recipients
  const toRecipients = Array.isArray(to) ? to : [to];
  const ccRecipients = Array.isArray(cc) ? cc : [cc];

  const payload = {
    to_recipients: toRecipients,
    cc_recipients: ccRecipients,
    subject,
    body,
    priority,
    attachments
  };

  try {
    await axios.post(MAIL_SERVICE_URL, payload);
  } catch (error) {
    console.error('Mail service error:', error?.response?.data || error.message);
    throw new Error('Failed to queue email');
  }
}


// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendMail = async (to, subject, html) => {
//   await transporter.sendMail({
//     from: `"ClarifAI" <${process.env.EMAIL_USER_CLARIFAI}>`,
//     to,
//     subject,
//     html,
//   });
// };

// export default sendMail;
