import express from "express";
import {
  register,
  resendOTP,
  verifyOTP,
  refresh
} from "../../controllers/auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { registerValidation } from "../../validations/auth.formValidation.js";

const router = express.Router();

router.post("/register", validateRequest(registerValidation), register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/refresh", refresh);

export default router;