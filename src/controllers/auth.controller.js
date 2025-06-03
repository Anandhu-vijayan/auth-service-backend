import * as AuthService from "../services/authService.js";
import * as OTPService from "../services/otpService.js";
import { User, Role, RefreshToken } from "../../database/models/index.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"; // <-- fixed here
dotenv.config();

// Register
export const register = async (req, res, next) => {
  try {
    const result = await AuthService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Resend OTP
export const resendOTP = async (req, res, next) => {
  try {
    const result = await OTPService.authResendOTP(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const result = await OTPService.authVerifyOTP(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Refresh Token
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // 1. Find the refresh token in the DB
    const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

    if (!storedToken || storedToken.revokedAt) {
      return res.status(401).json({ message: 'Invalid or revoked refresh token' });
    }

    // 2. Optionally: Check if expired
    if (storedToken.expiresAt && new Date(storedToken.expiresAt) < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // 3. Find the user
    const user = await User.findByPk(storedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Generate new access token (and optionally a new refresh token)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Optionally rotate the refresh token (recommended for security)
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Mark old token as revoked
    storedToken.revokedAt = new Date();
    await storedToken.save();

    // Store the new refresh token in DB
    await RefreshToken.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // 5. Respond with new tokens
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};