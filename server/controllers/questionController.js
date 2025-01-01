const Question = require('../models/questionModel');

// Create a question
exports.createQuestion = async (req, res) => {
    try {
        const { text, options, correctOptionId, timeLimit } = req.body;
        
        // Validate options
        if (!Array.isArray(options) || options.length < 2 || options.length > 4) {
            return res.status(400).json({ 
                message: 'Questions must have 2-4 options' 
            });
        }

        const question = await Question.create({
            text,
            option: options,
            correctOptionId,
            timeLimit
        });

        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get question by ID
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update question
exports.updateQuestion = async (req, res) => {
    try {
        const { text, options, correctOptionId, timeLimit } = req.body;
        
        // Validate options if provided
        if (options && (!Array.isArray(options) || options.length < 2 || options.length > 4)) {
            return res.status(400).json({ 
                message: 'Questions must have 2-4 options' 
            });
        }

        const question = await Question.findByIdAndUpdate(
            req.params.id,
            {
                text,
                option: options,
                correctOptionId,
                timeLimit
            },
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bulk create questions
exports.bulkCreateQuestions = async (req, res) => {
    try {
        const { questions } = req.body;
        
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ 
                message: 'Questions array is required' 
            });
        }

        // Validate all questions
        for (const question of questions) {
            if (!question.text || !question.options || 
                question.options.length < 2 || question.options.length > 4) {
                return res.status(400).json({ 
                    message: 'Invalid question format' 
                });
            }
        }

        const createdQuestions = await Question.insertMany(
            questions.map(q => ({
                text: q.text,
                option: q.options,
                correctOptionId: q.correctOptionId,
                timeLimit: q.timeLimit
            }))
        );

        res.status(201).json(createdQuestions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};