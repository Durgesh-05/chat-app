import { Router } from 'express';
import {
  usersData,
  userSignin,
  userSignup,
} from '../controllers/user.controller';
const router = Router();

router.post('/signin', userSignin);
router.post('/signup', userSignup);
router.get('/:id', usersData);

export default router;
