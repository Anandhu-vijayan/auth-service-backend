import sendOTP from "../utils/sendOtp.js";

export const authResendOTP = async ({email}) => {
  if (!email) return res.status(400).json({ message: 'Email is required' });
  try {
    await sendOTP(email);
    return { message: 'OTP resent successfully' };
  } catch (err) {
    // console.error('Resend OTP error:', err);
    return { message: 'Internal server error' }
  }
}

export const authVerifyOTP = async ({email, otp}) => {
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate OTP format (6 digits)
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    return res.status(400).json({ message: 'Invalid OTP format' });
  }

  // Check if OTP exists in Redis
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
}