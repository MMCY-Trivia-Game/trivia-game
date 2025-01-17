const Game = require('../models/gameModel');
const { generateGameId } = require('../utils/helper');

// Create a new game
const createGame = async (req, res) => {
  try {
    const { title, questions } = req.body;
    
    // Add time limit to questions if not provided
    const questionsWithTime = questions.map(q => ({
      ...q,
      timeLimit: q.timeLimit || 30
    }));

    const game = await Game.create({
      title,
      questions: questionsWithTime,
      game_code: generateGameId(),
      creator: req.user?._id
    });

    res.status(201).json(game);
  } catch (error) {
    console.error('Create game error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get active games
const getActiveGames = async (req, res) => {
  try {
    const games = await Game.find({ 
      is_active: true,
      creator: req.user?._id
    });
    res.json(games);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get game by ID
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Activate a game
const activateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { 
        is_active: true,
        start_time: new Date()
      },
      { new: true }
    );
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// End a game
const endGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const endTime = new Date();
    const duration = (endTime - game.start_time) / 1000; // Convert to seconds

    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      { 
        is_active: false,
        end_time: endTime,
        duration: duration
      },
      { new: true }
    );
    
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createGame,
  getActiveGames,
  getGameById,
  activateGame,
  endGame
}; 