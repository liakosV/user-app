const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller')

router.post('/login', authController.login);
router.get('/google/callback', authController.googleLogin) // 1


module.exports = router;

// https://accounts.google.com/o/oauth2/auth?client_id=89363880805-kjobi9a6lus3dv1f7fbh9urpkcn1oodc.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/google/callback&response_type=code&scope=email%20profile&access_type=offline