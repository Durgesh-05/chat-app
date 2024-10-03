import { Router } from 'express';
import { userSignin, userSignup } from '../controllers/user.controller';
const router = Router();

router.post('/signin', userSignin);
router.post('/signup', userSignup);

export default router;
