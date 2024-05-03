import { Router } from 'express';
import { deleteCard, dislikeCard, getCards, likeCard, postCard } from '../contorllers/card';
import { cardIdValidator, postCardVal } from '../utils/validation';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', postCardVal, postCard);
router.delete('/cards/:cardId', cardIdValidator, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidator, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidator, dislikeCard);

export default router;
