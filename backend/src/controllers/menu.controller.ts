import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * @desc    Get all menu items
 * @route   GET /api/v1/menu
 * @access  Public
 */
export const getAllMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, available } = req.query;

    // Build filter
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (available !== undefined) {
      filter.available = available === 'true';
    }

    const menuItems = await prisma.menuItem.findMany({
      where: filter,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    successResponse(
      res,
      {
        count: menuItems.length,
        items: menuItems,
      },
      'Menu items retrieved successfully',
      200
    );
  } catch (error) {
    logger.error('Get all menu items error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving menu items', 500);
  }
};

/**
 * @desc    Get menu item by ID
 * @route   GET /api/v1/menu/:id
 * @access  Public
 */
export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      errorResponse(res, 'NOT_FOUND', 'Menu item not found', 404);
  }

    successResponse(res, menuItem, 'Menu item retrieved successfully', 200);
  } catch (error) {
    logger.error('Get menu item by ID error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving menu item', 500);
  }
};

/**
 * @desc    Create menu item
 * @route   POST /api/v1/menu
 * @access  Private (Admin/Manager)
 */
export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;

    if (!['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
  }

    const {
      name,
      description,
      price,
      category,
      imageUrl,
      available,
      dietaryTags,
      preparationTime,
    } = req.body;

    // Validation
    if (!name || !price || !category) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Please provide name, price, and category',
        400
      );
  }

    // Validate category
    const validCategories = ['appetizers', 'mains', 'desserts', 'drinks', 'specials'];
    if (!validCategories.includes(category)) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Invalid category. Must be one of: appetizers, mains, desserts, drinks, specials',
        400
      );
  }

    // Validate price
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      errorResponse(res, 'VALIDATION_ERROR', 'Price must be a positive number', 400);
  }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price: priceNum,
        category,
        imageUrl: imageUrl || null,
        available: available !== undefined ? available : true,
        dietaryTags: dietaryTags || [],
        preparationTime: preparationTime || 15,
      },
    });

    logger.info(`Menu item created: ${menuItem.id} - ${menuItem.name}`);

    successResponse(res, menuItem, 'Menu item created successfully', 201);
  } catch (error) {
    logger.error('Create menu item error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error creating menu item', 500);
  }
};

/**
 * @desc    Update menu item
 * @route   PUT /api/v1/menu/:id
 * @access  Private (Admin/Manager)
 */
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;

    if (!['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
  }

    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      imageUrl,
      available,
      dietaryTags,
      preparationTime,
    } = req.body;

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      errorResponse(res, 'NOT_FOUND', 'Menu item not found', 404);
  }

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        errorResponse(res, 'VALIDATION_ERROR', 'Price must be a positive number', 400);
  }
      updateData.price = priceNum;
    }
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (available !== undefined) updateData.available = available;
    if (dietaryTags !== undefined) updateData.dietaryTags = dietaryTags;
    if (preparationTime !== undefined) updateData.preparationTime = preparationTime;

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Menu item updated: ${id} - ${updatedMenuItem.name}`);

    successResponse(res, updatedMenuItem, 'Menu item updated successfully', 200);
  } catch (error) {
    logger.error('Update menu item error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error updating menu item', 500);
  }
};

/**
 * @desc    Delete menu item
 * @route   DELETE /api/v1/menu/:id
 * @access  Private (Admin/Manager)
 */
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;

    if (!['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
  }

    const { id } = req.params;

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      errorResponse(res, 'NOT_FOUND', 'Menu item not found', 404);
  }

    // Soft delete by marking as unavailable instead of actual deletion
    // This preserves order history
    const deletedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        available: false,
      },
    });

    logger.info(`Menu item soft deleted: ${id} - ${deletedMenuItem.name}`);

    successResponse(res, deletedMenuItem, 'Menu item deleted successfully', 200);
  } catch (error) {
    logger.error('Delete menu item error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error deleting menu item', 500);
  }
};

/**
 * @desc    Get menu categories
 * @route   GET /api/v1/menu/categories
 * @access  Public
 */
export const getMenuCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = [
      { value: 'appetizers', label: 'Appetizers' },
      { value: 'mains', label: 'Main Course' },
      { value: 'desserts', label: 'Desserts' },
      { value: 'drinks', label: 'Drinks' },
      { value: 'specials', label: 'Chef Specials' },
    ];

    successResponse(res, categories, 'Categories retrieved successfully', 200);
  } catch (error) {
    logger.error('Get menu categories error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving categories', 500);
  }
};

