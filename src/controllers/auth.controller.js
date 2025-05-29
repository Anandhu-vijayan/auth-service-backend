import bcrypt from 'bcrypt';
import sendOTP from '../utils/sendOtp.js';
import { User, Role } from '../../database/models/index.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Find existing user by email
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res
          .status(409)
          .json({ message: 'Email already registered' });
      } else {
        // Update the unverified user instead of creating a new one
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.name = name;
        existingUser.passwordHash = hashedPassword;
        await existingUser.save();

        await sendOTP(email);

        return res.status(200).json({
          message: 'User updated successfully. OTP sent to email.',
          data: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: (await existingUser.getRole())?.name || 'user',
          },
        });
      }
    }

    // No user exists, create new
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = await Role.findOne({ where: { name: 'user' } });

    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      roleId: userRole?.id,
    });

    await sendOTP(email);

    return res.status(201).json({
      message: 'User registered successfully. OTP sent to email.',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: userRole?.name || 'user',
      },
    });
  } catch (err) {
    // If error is a unique constraint error, handle gracefully
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};