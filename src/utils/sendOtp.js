import redis from '../../config/redis.config.js';
import sendMail from './auth.mailer.js';

const sendOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in Redis with 60 seconds expiry
  await redis.set(`otp:${email}`, otp, 'EX', 60);

  // Email content
  const subject = 'Your OTP for registration with ClarifAI  - ';
  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your OTP for registration with ClarifAI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background: #f7f8fa;
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 420px;
      margin: 40px auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.09);
      padding: 32px 28px;
    }
    .header {
      text-align: center;
      margin-bottom: 16px;
    }
    .header img {
      width: 50px;
      margin-bottom: 16px;
    }
    .title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #252f3f;
      margin-bottom: 8px;
    }
    .otp-box {
      margin: 24px 0;
      text-align: center;
    }
    .otp-code {
      letter-spacing: 0.4em;
      font-size: 2rem;
      font-weight: bold;
      color: #2e6cf6;
      background: #eef4ff;
      padding: 14px 24px;
      border-radius: 8px;
      display: inline-block;
      border: 1.5px dashed #b6cdfc;
    }
    .expires {
      font-size: 0.97rem;
      color: #555;
      margin-top: 8px;
      text-align: center;
    }
    .footer {
      margin-top: 28px;
      font-size: 0.92rem;
      color: #9ea7b6;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Optional: Add your logo here -->
      <!-- <img src="https://yourdomain.com/logo.png" alt="ClarifAI Logo"> -->
      <div class="title">Your OTP for registration with ClarifAI</div>
    </div>
    <p>Hello,</p>
    <p>Use the following OTP code to complete your registration:</p>
    <div class="otp-box">
      <span class="otp-code">${otp}</span>
      <div class="expires">This code will expire in <b>30 seconds</b>.</div>
    </div>
    <p>If you did not request this, you can safely ignore this email.</p>
    <div class="footer">
      &copy; ClarifAI · Please do not reply to this email.
    </div>
  </div>
</body>
</html>
  `;

  // Send Email
  // await sendMail(email, subject, html);
  await sendMail(
    email,
    subject,
    html,
    {
      cc: [],
      priority: 'medium',
      attachments: []
    }
  );
};

export default sendOTP;
