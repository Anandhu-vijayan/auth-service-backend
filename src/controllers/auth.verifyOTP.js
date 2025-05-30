import jwt from 'jsonwebtoken';
import redis from '../../config/redis.config.js';
import { User, Role } from '../../database/models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

function generateTokens(user) {
  const payload = { userId: user.id, email: user.email, role: user.roleId };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }); // short-lived
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' }); // long-lived
  return { accessToken, refreshToken };
}

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
    await redis.del(`otp:${email}`);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // (Optional) Store refreshToken in DB for revocation, or just rely on JWT signature

    // Set tokens in HTTP-only, secure cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15, // 15 minutes
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(200).json({
      message: 'Email verified successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (await user.getRole())?.name || 'user',
      },
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};