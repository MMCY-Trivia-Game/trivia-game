const Game = require('../models/gameModel');

exports.createGame = async (req, res) => {
    try {
        const { title } = req.body;
        const game = await Game.create({
            title,
            is_active: true
        });
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getGames = async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 });
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 