import redis from '../../config/redis.config.js';
import { User, Role } from '../../database/models/index.js';
// import { register } from './auth.register.js'; // Assuming register is moved to its own module

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.isVerified = true;
    await user.save();

    // Optional: delete OTP from Redis
    await redis.del(`otp:${email}`);

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

