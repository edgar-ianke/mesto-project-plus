import { deleteCard, dislikeCard, getCards, likeCard, postCard } from "../contorllers/card";
import { Router } from "express";

const router = Router();

router.get('/cards', getCards);
router.post('/cards', postCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

export default router