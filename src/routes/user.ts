import { Router } from 'express';
import { changeAvatar, changeUserInfo, getUserById, getUsers, getUser } from '../contorllers/user';
import { changeAvatarVal, changeUserInfoVal, userIdValidator } from '../utils/validation';

const router = Router();

router.get('/users', getUsers);
router.get('/users/me', getUser);
router.patch('/users/me', changeUserInfoVal, changeUserInfo);
router.patch('/users/me/avatar', changeAvatarVal, changeAvatar);
router.get('/users/:userId', userIdValidator, getUserById);

export default router;
