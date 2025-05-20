const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Verification Code",
    html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
