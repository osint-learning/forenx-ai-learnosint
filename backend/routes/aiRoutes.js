const express = require("express");

const router = express.Router();

const {
    testAI,
    recommendTools,
    suggestCommand,
    personalizedLearningRecommendations,
    generateAIQuiz,
    evaluateAIQuiz,
    evaluateAILab,
    generateAIHint,
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

/*
|--------------------------------------------------------------------------
| AI Quiz Generation
|--------------------------------------------------------------------------
*/

router.post(
    "/generate-quiz",
    protect,
    generateAIQuiz
);

/*
|--------------------------------------------------------------------------
| AI Quiz Evaluation
|--------------------------------------------------------------------------
*/

router.post(
    "/evaluate-quiz",
    protect,
    evaluateAIQuiz
);


/*
|--------------------------------------------------------------------------
| AI Practice Lab Evaluation
|--------------------------------------------------------------------------
*/

router.post(
    "/evaluate-lab",
    protect,
    evaluateAILab
);

/*
|--------------------------------------------------------------------------
| AI Investigation Hint
|--------------------------------------------------------------------------
*/

router.post(
    "/investigation-hint",
    protect,
    generateAIHint
);

module.exports = router;