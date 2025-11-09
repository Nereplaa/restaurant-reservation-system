import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuCategories,
} from '../controllers/menu.controller';

const router = Router();

/**
 * @route   GET /api/v1/menu/categories
 * @desc    Get menu categories
 * @access  Public
 */
router.get('/categories', getMenuCategories);

/**
 * @route   GET /api/v1/menu
 * @desc    Get all menu items
 * @access  Public
 */
router.get('/', getAllMenuItems);

/**
 * @route   POST /api/v1/menu
 * @desc    Create menu item
 * @access  Private (Admin/Manager)
 */
router.post('/', authenticateToken, createMenuItem);

/**
 * @route   GET /api/v1/menu/:id
 * @desc    Get menu item by ID
 * @access  Public
 */
router.get('/:id', getMenuItemById);

/**
 * @route   PUT /api/v1/menu/:id
 * @desc    Update menu item
 * @access  Private (Admin/Manager)
 */
router.put('/:id', authenticateToken, updateMenuItem);

/**
 * @route   DELETE /api/v1/menu/:id
 * @desc    Delete menu item
 * @access  Private (Admin/Manager)
 */
router.delete('/:id', authenticateToken, deleteMenuItem);

export default router;

