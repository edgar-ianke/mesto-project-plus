import { changeAvatar, changeUserInfo, createUser, getUserById, getUsers } from '../contorllers/user';
import { Router } from "express";

const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', changeUserInfo)
router.patch('/users/me/avatar', changeAvatar)

export default router;