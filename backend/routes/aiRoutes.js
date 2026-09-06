const express = require("express");

const router = express.Router();

const {
    testAI,
    recommendTools,
    suggestCommand,
    personalizedLearningRecommendations,
} = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");


/*
|--------------------------------------------------------------------------
| AI Test
|--------------------------------------------------------------------------
*/

router.post(
    "/test",
    protect,
    testAI
);


/*
|--------------------------------------------------------------------------
| Intelligent Tool Recommendation
|--------------------------------------------------------------------------
*/

router.post(
    "/recommend-tools",
    protect,
    recommendTools
);


/*
|--------------------------------------------------------------------------
| AI Command Suggestion
|--------------------------------------------------------------------------
*/

router.post(
    "/suggest-command",
    protect,
    suggestCommand
);


/*
|--------------------------------------------------------------------------
| Personalized Learning Recommendations
|--------------------------------------------------------------------------
*/

router.post(
    "/personalized-learning",
    protect,
    personalizedLearningRecommendations
);


module.exports = router;