const express = require('express');
const { check } = require('express-validator');
const { 
  createBook, 
  getBooks, 
  getBookById, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Book routes with validation
router.route('/')
  .post(
    [
      check('title', 'Title is required').notEmpty(),
      check('author', 'Author is required').notEmpty(),
      check('category', 'Category is required').notEmpty(),
      check('price', 'Price must be a positive number').isFloat({ min: 0 }),
      check('rating', 'Rating must be between 0 and 5').optional().isFloat({ min: 0, max: 5 }),
      check('publishedDate', 'Published date is required').notEmpty()
    ],
    createBook
  )
  .get(getBooks);

router.route('/:id')
  .get(getBookById)
  .put(
    [
      check('title', 'Title is required').optional().notEmpty(),
      check('author', 'Author is required').optional().notEmpty(),
      check('category', 'Category is required').optional().notEmpty(),
      check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
      check('rating', 'Rating must be between 0 and 5').optional().isFloat({ min: 0, max: 5 }),
      check('publishedDate', 'Published date is required').optional().notEmpty()
    ],
    updateBook
  )
  .delete(deleteBook);

module.exports = router;