const Book = require('../models/Book');
const { validationResult } = require('express-validator');

exports.createBook = async (req, res, next) => {
  try {
    //checking validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, author, category, price, rating, publishedDate } = req.body;

    //creating a book
    const book = await Book.create({
      title,
      author,
      category,
      price,
      rating,
      publishedDate
    });

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (err) {
    next(err);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    //building a query
    let query = {};
    
    //filtering by author
    if (req.query.author) {
      query.author = req.query.author;
    }
    
    //filtering by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    //filtering by rating
    if (req.query.rating) {
      query.rating = { $gte: parseFloat(req.query.rating) };
    }
    
    //searching by title
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    //sorting as per users choice
    let sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      sort = { createdAt: -1 }; //by default, sorting by newest
    }

    //executing query
    const books = await Book.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit);
    
    //getting total count for pagination info
    const total = await Book.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: books.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: books
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    await book.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    next(err);
  }
};