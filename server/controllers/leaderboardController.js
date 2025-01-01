const Leaderboard = require('../models/leaderboardModel');
const Game = require('../models/gameModel');

exports.updateLeaderboard = async (req, res) => {
    try {
        const { id: gameId } = req.params;
        const { user_id, score, response_time } = req.body;

        let leaderboardEntry = await Leaderboard.findOne({
            game_id: gameId,
            user_id
        });

        if (leaderboardEntry) {
            leaderboardEntry.score = score;
            leaderboardEntry.response_time = response_time;
            await leaderboardEntry.save();
        } else {
            leaderboardEntry = await Leaderboard.create({
                game_id: gameId,
                user_id,
                score,
                response_time
            });
        }

        // Update ranks 
        await updateRanks(gameId);

        // Get updated leaderboard
        const leaderboard = await getGameLeaderboard(gameId);
        
        //  update via Socket.IO 
        req.app.get('io').to(`game:${gameId}`).emit('leaderboard:update', leaderboard);

        res.json(leaderboardEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const { id: gameId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await getGameLeaderboard(gameId, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGameResults = async (req, res) => {
    try {
        const { id: gameId } = req.params;
        const results = await Leaderboard.find({ game_id: gameId })
            .sort({ score: -1, response_time: 1 })
            .populate('user_id', 'first_name last_name')
            .lean();

        const topScore = results[0]?.score || 0;
        
        const formattedResults = results.map(result => ({
            ...result,
            isTopPerformer: result.score === topScore
        }));

        res.json(formattedResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.archiveGame = async (req, res) => {
    try {
        const { id: gameId } = req.params;
        
        // Update game status
        await Game.findByIdAndUpdate(gameId, { is_active: false });
        
        // Archive leaderboard entries
        await Leaderboard.updateMany(
            { game_id: gameId },
            { is_active: false }
        );

        res.json({ message: 'Game archived successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.handleReconnect = async (req, res) => {
    try {
        const { id: gameId } = req.params;
        const { user_id } = req.body;

        const entry = await Leaderboard.findOne({
            game_id: gameId,
            user_id,
            is_active: true
        });

        if (!entry) {
            return res.status(404).json({ message: 'No active session found' });
        }

        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper Function
async function updateRanks(gameId) {
    const entries = await Leaderboard.find({ game_id: gameId })
        .sort({ score: -1, response_time: 1 });
    
    for (let i = 0; i < entries.length; i++) {
        entries[i].rank = i + 1;
        await entries[i].save();
    }
}

async function getGameLeaderboard(gameId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [leaderboard, total] = await Promise.all([
        Leaderboard.find({ game_id: gameId })
            .sort({ score: -1, response_time: 1 })
            .populate('user_id', 'first_name last_name')
            .select('-__v')
            .skip(skip)
            .limit(limit)
            .lean(),
        Leaderboard.countDocuments({ game_id: gameId })
    ]);

    return {
        leaderboard,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            hasMore: skip + leaderboard.length < total
        }
    };
} 