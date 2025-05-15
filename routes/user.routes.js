const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/auth.middleware').verifyToken
const verifyRoles = require('../middleware/auth.middleware').verifyRoles

router.get('/', verifyToken, userController.findAll);
router.get('/:username', verifyToken, verifyRoles("ADMIN"), userController.findOne);
// router.post('/', verifyToken, verifyRoles("ADMIN"), userController.create);
// router.post('/', userController.create);
router.patch('/:username', verifyToken, verifyRoles("ADMIN"), userController.update);
router.delete('/:username', verifyToken, verifyRoles("ADMIN"), userController.deleteByUsername);
router.delete('/:username/email/:email', verifyToken, verifyRoles("ADMIN"), userController.deleteByEmail);
router.get('/check_duplicate_email/:email', userController.checkDuplicateEmail);
module.exports = router;