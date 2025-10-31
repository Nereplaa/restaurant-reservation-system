import { Router } from 'express';

const router = Router();

/**
 * @route   GET /api/v1/menu
 * @desc    Get all menu items
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({ message: 'Get menu items - TODO: Implement' });
});

/**
 * @route   GET /api/v1/menu/:id
 * @desc    Get menu item by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  res.json({ message: `Get menu item ${req.params.id} - TODO: Implement` });
});

export default router;

