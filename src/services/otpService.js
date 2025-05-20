const redis = require("../../config/redis");

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function storeOTP(email, otp) {
  await redis.set(`otp:${email}`, otp, "EX", 300); // 5 minutes
}

async function verifyOTP(email, otp) {
  const storedOTP = await redis.get(`otp:${email}`);
  return storedOTP === otp;
}

async function deleteOTP(email) {
  await redis.del(`otp:${email}`);
}

module.exports = { generateOTP, storeOTP, verifyOTP, deleteOTP };
