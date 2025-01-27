const { check, validationResult } = require("express-validator");
const Game = require('../models/gameModel')
const Leaderboard = require('../models/leaderboardModel')
const Question = require('../models/questionModel')
const User = require('../models/userModel')

const asyncHandler = require("express-async-handler"); const leaderboardModel = require("../models/leaderboardModel");





/**
 * @des Dashboard Stats
 * @route POST /api/dashboard/stat
 * @access Private
 */
exports.dashboardStat = asyncHandler(async (req, res) => {
    const activeGamesCount = await Game.countDocuments({ is_active: true });
    const playersCount = await Leaderboard.countDocuments()
    const questionCount = await Question.countDocuments()
    const activeCreatorCount = await User.countDocuments({ is_active: true, role: 'creator' })
    const totalGamesCount = await Game.countDocuments();

    const topCategories = await Game.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 5
        },
        {
            $match: { count: { $gt: 1 } } // Ensures categories have multiple games
        }
    ]);

    const monthlyGamePlayers = await Game.aggregate([
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        },
        {
            $project: {
                month: {
                    $arrayElemAt: [
                        ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        { $subtract: ["$_id.month", 1] }
                    ]
                },
                year: "$_id.year",
                count: 1,
                _id: 0
            }
        }
    ]);

    const averagePlayerPerGame = await Game.aggregate([
        {
            $group: {
                _id: null, // Group all documents together
                averagePlayersPerGame: { $avg: "$maxUsers" } // Calculate the average of maxUsers
            }
        },
        {
            $project: {
                _id: 0, // Exclude the _id from the output
                averagePlayersPerGame: 1
            }
        }
    ]);

    const averageScorePerPlayer = await Leaderboard.aggregate([
        {
            $group: {
                _id: "$user_name", // Group by user_name to calculate average score per player
                averageScore: { $avg: "$score" } // Calculate the average score for each player
            }
        },
        {
            $group: {
                _id: null, // Group all players to calculate the overall average
                overallAverageScore: { $avg: "$averageScore" } // Calculate the average of the average scores
            }
        },
        {
            $project: {
                _id: 0, // Exclude the _id from the output
                overallAverageScore: 1
            }
        }
    ]);



    res.status(200).json({
        "dashboard": { activeGamesCount, playersCount, questionCount, activeCreatorCount, totalGamesCount },
        "topCategories": topCategories,
        "monthlyGamePlayers": monthlyGamePlayers,
        averagePlayerPerGame,
        averageScorePerPlayer
    })

})


/**
 * @des Dashboard Stats
 * @route POST /api/dashboard/games
 * @access Private
 */
exports.getAllGames = async (req, res, next) => {
    try {
        const { is_active, category, q } = req.query;

        const options = {
            page: req.query.page || 1,
            limit: 18,
            collation: {
                locale: 'en',
            },
        };

        const filter = {};
        if (category) {
            filter.category = category;
        }

        if (is_active) {
            filter.is_active = is_active;
        }

        let searchQuery = {};

        if (q) {

            searchQuery = {
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } },
                ],
            };
        }

        const result = await Game.paginate({ ...searchQuery, ...filter }, options);
        const populatedDocs = await Game.populate(result.docs, {
            path: 'creator_id',
            select: 'first_name last_name email'
        });


        const response = {
            docs: populatedDocs,
            totalDocs: result.totalDocs,
            limit: result.limit,
            totalPages: result.totalPages,
            page: result.page,
            pagingCounter: result.pagingCounter,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        };


        res.json(response);
    } catch (error) {
        next(error);
    }
};


