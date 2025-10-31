import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/ai-chat/message
 * @desc    Send message to AI chatbot
 * @access  Private (Customer)
 */
router.post('/message', authenticateToken, (req, res) => {
  res.json({ message: 'AI chat message - TODO: Implement OpenAI integration' });
});

/**
 * @route   POST /api/v1/ai-chat/complete-reservation
 * @desc    Complete reservation from AI conversation
 * @access  Private (Customer)
 */
router.post('/complete-reservation', authenticateToken, (req, res) => {
  res.json({ message: 'Complete AI reservation - TODO: Implement' });
});

export default router;

