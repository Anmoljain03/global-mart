import express from 'express';
import { loginUser,registerUser,adminLogin, getUserProfile, getAllUsers, changeUserStatus, updateUserProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js'
import adminAuth  from '../middleware/adminAuth.js'
import upload from '../middleware/upload.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.get("/profile", authUser, getUserProfile);
userRouter.put('/update-profile', upload.single('profileImage'), updateUserProfile);

userRouter.get('/get-users', adminAuth, getAllUsers);
userRouter.put('/:userId/status', adminAuth, changeUserStatus);

export default userRouter;