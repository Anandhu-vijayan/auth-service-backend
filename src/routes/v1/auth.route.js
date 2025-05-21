// src/routes/auth.route.js
import express from 'express';
import { register } from '../../controllers/auth.controller.js';
import {verifyEmail} from '../../controllers/auth.verifyEmail.js'
import validateRequest from '../../middlewares/validateRequest.js';
import { registerValidation } from '../../validations/auth.formValidation.js';

const router = express.Router();

router.post('/register', validateRequest(registerValidation), register);
router.post('/verify-email', verifyEmail);

export default router;
