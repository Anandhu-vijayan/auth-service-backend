const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const validateRequest = require('../../middlewares/validateRequest');
const { registerValidation } = require('../../validations/auth.validation');

router.post('/register', validateRequest(registerValidation), authController.register);
router.post("/verify-email", authController.verifyEmail);

module.exports = router;
