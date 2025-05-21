import redis from '../../config/redis.js';
import sendMail from './auth.mailer.js';

const sendOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in Redis with 5-minute expiry
  await redis.set(`otp:${email}`, otp, 'EX', 300);

  // Email content
  const subject = 'Your OTP Code - FixFinder';
  const html = `
    <p>Hello,</p>
    <p>Your OTP code is: <b>${otp}</b></p>
    <p>This code will expire in 5 minutes.</p>
  `;

  // Send Email
  await sendMail(email, subject, html);
};

export default sendOTP;
