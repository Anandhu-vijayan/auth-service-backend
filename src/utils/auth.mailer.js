import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"FixFinder Auth" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendMail;
