import sendOTP from "../utils/sendOtp.js";
import httpError from "../utils/httpError.js";
import { User } from "../../database/models/index.js";
import generateTokens from "../utils/generateTokens.js"; // however you do it
import redis from "../../config/redis.config.js"; 
export const authResendOTP = async ({ email }) => {
  if (!email) throw httpError(409, "Email is required");
  try {
    await sendOTP(email);
    return { message: "OTP resent successfully" };
  } catch (err) {
    throw httpError(500, "Internal server error");
  }
};

export const authVerifyOTP = async ({ email, otp }) => {
  if (!email || !otp) throw httpError(400, "Email and OTP are required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw httpError(400, "Invalid email format");

  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) throw httpError(400, "Invalid OTP format");

  try {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp)
      throw httpError(400, "Invalid or expired OTP");

    const user = await User.findOne({ where: { email } });
    if (!user) throw httpError(404, "User not found");
    if (user.isVerified) throw httpError(400, "Email already verified");

    user.isVerified = true;
    await user.save();
    await redis.del(`otp:${email}`);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    return {
      message: "Email verified successfully",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (await user.getRole())?.name || "user",
      },
      tokens: { accessToken, refreshToken },
    };
  } catch (err) {
    console.error("authVerifyOTP error:", err); // <--- add this!

    // If already an httpError, re-throw
    if (err.status) throw err;
    throw httpError(500, "Internal server error");
  }
};
