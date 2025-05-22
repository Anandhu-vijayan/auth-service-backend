import bcrypt from 'bcrypt';
import sendOTP from '../utils/sendOtp.js';
// import { User } from '../../database/models/user.model.js';
// import { Role } from '../../database/models/role.model.js';
import { User, Role } from '../../database/models/index.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res
          .status(409)
          .json({ message: 'Email already registered and verified' });
      } else {
        return res.status(400).json({
          message:
            'Email already registered but not verified. Please verify your email.',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
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
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
