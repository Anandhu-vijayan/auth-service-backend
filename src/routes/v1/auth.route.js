// src/routes/auth.route.js
import express from 'express';
import { register } from '../../controllers/auth.controller.js';
import {verifyOTP} from '../../controllers/auth.verifyOTP.js'
import validateRequest from '../../middlewares/validateRequest.js';
import { registerValidation } from '../../validations/auth.formValidation.js';

const router = express.Router();

router.post('/register', validateRequest(registerValidation), register);
router.post('/verify-otp', verifyOTP);

export default router;
