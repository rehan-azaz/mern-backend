import express from 'express';

import userController from '../controller/userController.js';
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/logout', userController.logoutUser);

router.post('/password/forgot', userController.forgotPassword);

router.put('/password/reset/:token', userController.resetPassword);

router.get('/me', authUser.isAuthenticatedUser, userController.getUserInfo);

router.put('/password/update', authUser.isAuthenticatedUser, userController.updateUserPassword);

router.put('/me/update', authUser.isAuthenticatedUser, userController.updateUserProfile);

export default router;