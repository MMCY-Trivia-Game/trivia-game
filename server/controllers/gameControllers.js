const Game = require('../models/gameModel');

exports.createGame = async (req, res, next) => {
  try {
    const { title, maxUsers, game_code } = req.body;
    const game = await Game.create({
      creator_id: req.user.id,
      title,
      maxUsers,
      game_code,
    });
    res.status(201).json({ message: 'Game created successfully!', game });
  } catch (error) {
    next(error);
  }
};

exports.getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find(
      req.query.is_active ? { is_active: req.query.is_active } : {}
    ).populate('creator_id', 'first_name last_name email');
    res.json(games);
  } catch (error) {
    next(error);
  }
};

exports.getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) {
      res.status(404);
      throw new Error('Game not found!');
    }
    res.json({ game });
  } catch (error) {
    next(error);
  }
};

exports.getGamesByCreatorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const games = await Game.find({ creator_id: id });
    if (!games) {
      res.status(404);
      throw new Error('Game not found!');
    }
    res.json({ games });
  } catch (error) {
    next(error);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(id, req.body, { new: true });
    if (!game) {
      res.status(404);
      throw new Error('Game not found!');
    }
    res.json({ message: 'Game updated successfully!', game });
  } catch (error) {
    next(error);
  }
};

exports.activateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(
      id,
      { is_active: true },
      { new: true }
    );
    if (!game) {
      res.status(404); // Not Found
      throw new Error('Game not found!');
    }
    res.json({ message: 'Game activated successfully!', game });
  } catch (error) {
    next(error);
  }
};

exports.deactivateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(
      id,
      { is_active: false },
      { new: true }
    );
    if (!game) {
      res.status(404);
      throw new Error('Game not found!');
    }
    res.json({ message: 'Game deactivated successfully!', game });
  } catch (error) {
    next(error);
  }
};

exports.addQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question_id } = req.body;
    const game = await Game.findByIdAndUpdate(
      id,
      { $push: { question_ids: question_id } },
      { new: true }
    );
    if (!game) {
      res.status(404);
      throw new Error('Game not found!');
    }
    res.json({ message: 'Question added successfully!', game });
  } catch (error) {
    next(error);
  }
};

exports.clearQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(
      id,
      { $set: { question_ids: [] } },
      { new: true }
    );
    if (!game) {
      res.status(404);
      throw new Error('Game not found!');
    }
    res.json({ message: 'Questions cleared successfully!', game });
  } catch (error) {
    next(error);
  }
};

// export {
//   createGame,
//   getAllGames,
//   getGameById,
//   getGamesByCreatorId,
//   updateGame,
//   activateGame,
//   deactivateGame,
//   addQuestion,
//   clearQuestions,
// };
