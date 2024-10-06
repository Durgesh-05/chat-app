import { Router } from 'express';
import { fetchChats } from '../controllers/chat.controller';

const router = Router();

router.get('/:id1/:id2', fetchChats);

export default router;
