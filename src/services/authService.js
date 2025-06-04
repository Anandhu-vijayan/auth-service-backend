import { User } from "../../database/models/index.js";
import bcrypt from "bcrypt";
import { Role } from "../../database/models/index.js";
import sendOTP from "../utils/sendOtp.js";
import httpError from '../utils/httpError.js';

export async function registerUser({ email, password, name }) {
  const existingUser = await User.findOne({ where: { email } });
  // Check if user already exists
  if (existingUser) {
    if (existingUser.isVerified) {
      throw httpError(409, "Email already registered");
    } else {
      // Update the unverified user instead of creating a new one
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.name = name;
      existingUser.passwordHash = hashedPassword;
      await existingUser.save();

      await sendOTP(email);

      return {
        message: "User updated successfully. OTP sent to email.",
        data: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: (await existingUser.getRole())?.name || "user",
        },
      };
    }
  }

  // No user exists, create new
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = await Role.findOne({ where: { name: "user" } });

  const newUser = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
    roleId: userRole?.id,
  });

  await sendOTP(email);

  return {
    message: "User registered successfully. OTP sent to email.",
    data: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: userRole?.name || "user",
    },
  };
}
