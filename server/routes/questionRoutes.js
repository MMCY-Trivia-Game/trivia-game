const express = require('express');
const router = express.Router();
const {
    createQuestion,
    getAllQuestions,
    updateQuestion,
    deleteQuestion,
    bulkCreateQuestions,
    getQuestionById
} = require('../controllers/questionController');

// Basic CRUD routes
router.post('/', createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.patch('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

// Bulk operations
router.post('/bulk', bulkCreateQuestions);

module.exports = router;