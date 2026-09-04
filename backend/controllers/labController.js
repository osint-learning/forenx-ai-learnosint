const asyncHandler = require("express-async-handler");

const Lab = require("../models/Lab");
const LabProgress = require("../models/LabProgress");


// ======================================================
// GET ALL ACTIVE LABS
// ======================================================

const getLabs = asyncHandler(async (req, res) => {

    const labs = await Lab.find({
        isActive: true,
    }).sort({
        createdAt: 1,
    });

    const progressRecords =
        await LabProgress.find({
            user: req.user._id,
            lab: {
                $in: labs.map(lab => lab._id),
            },
        });

    const progressMap = new Map(
        progressRecords.map(progress => [
            progress.lab.toString(),
            progress,
        ])
    );

    const labsWithProgress = labs.map(lab => {

        const progress =
            progressMap.get(
                lab._id.toString()
            );

        const objectives = lab.objectives.map(
            (objective, index) => {

                const savedObjective =
                    progress?.objectives?.find(
                        item =>
                            item.objectiveIndex ===
                            index
                    );

                return {
                    ...objective.toObject(),
                    completed:
                        savedObjective?.completed ||
                        false,
                };
            }
        );

        return {
            ...lab.toObject(),

            objectives,

            progress: {
                completed:
                    progress?.completed ||
                    false,

                xpAwarded:
                    progress?.xpAwarded ||
                    false,

                objectives:
                    progress?.objectives || [],
            },
        };
    });

    res.json({
        success: true,
        count: labsWithProgress.length,
        data: labsWithProgress,
    });
});

// ======================================================
// GET SINGLE LAB + USER PROGRESS
// ======================================================

const getLabById = asyncHandler(async (req, res) => {

    const lab = await Lab.findOne({
        _id: req.params.id,
        isActive: true,
    });

    if (!lab) {
        return res.status(404).json({
            success: false,
            message: "Lab not found",
        });
    }

    const progress = await LabProgress.findOne({
        user: req.user._id,
        lab: lab._id,
    });

    res.json({
        success: true,

        data: lab,

        progress: progress || {
            objectives: [],
            completed: false,
            xpAwarded: false,
        },
    });
});


// ======================================================
// ANSWER NORMALIZATION
// ======================================================

const normalizeAnswer = (value) => {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
};


// ======================================================
// GET EXPECTED VALUE FROM REAL OUTPUT
// ======================================================

const getExpectedValue = (
    output,
    expectedField
) => {

    if (
        !output ||
        !expectedField
    ) {
        return null;
    }

    const whois =
        output.whois ||
        output.data?.whois ||
        null;


    switch (expectedField) {

        case "registrar":

            return (
                whois?.registrar ||
                null
            );


        case "creationDate":

            return (
                whois?.created ||
                whois?.creationDate ||
                null
            );


        case "updatedDate":

            return (
                whois?.updated ||
                whois?.updatedDate ||
                null
            );


        case "expirationDate":

            return (
                whois?.expires ||
                whois?.expirationDate ||
                null
            );


        case "nameServer":

            if (
                Array.isArray(
                    whois?.nameServers
                )
            ) {
                return whois.nameServers;
            }

            return (
                whois?.nameServers ||
                null
            );


        case "dnssec":

            return (
                whois?.dnssec ||
                null
            );


        case "status":

            return (
                whois?.status ||
                null
            );


        case "registrant":

            return (
                whois?.registrant ||
                null
            );


        case "whois":

            return whois
                ? "available"
                : null;


        default:

            return null;
    }
};


// ======================================================
// EVALUATE LAB ANSWER
// ======================================================

const evaluateLabAnswer =
    asyncHandler(async (req, res) => {

        const {
            objectiveIndex,
            answer,
            output,
        } = req.body;


        // ----------------------------------------------
        // VALIDATION
        // ----------------------------------------------

        if (
            objectiveIndex === undefined ||
            objectiveIndex === null
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Objective index is required",
            });
        }


        if (
            answer === undefined ||
            answer === null ||
            typeof answer !== "string" ||
            !answer.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Answer is required",
            });
        }


        if (!output) {
            return res.status(400).json({
                success: false,
                message:
                    "Command output is required before evaluating the answer",
            });
        }


        // ----------------------------------------------
        // GET LAB
        // ----------------------------------------------

        const lab =
            await Lab.findOne({
                _id: req.params.id,
                isActive: true,
            });


        if (!lab) {
            return res.status(404).json({
                success: false,
                message:
                    "Lab not found",
            });
        }


        // ----------------------------------------------
        // GET OBJECTIVE
        // ----------------------------------------------

        const objective =
            lab.objectives[
                objectiveIndex
            ];


        if (!objective) {
            return res.status(404).json({
                success: false,
                message:
                    "Objective not found",
            });
        }


        // Command objectives are not
        // evaluated through answer submission
        if (
            objective.type === "command"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This objective is completed through command execution.",
            });
        }


        // ----------------------------------------------
        // GET EXPECTED ANSWER
        // ----------------------------------------------

        const expectedValue =
            getExpectedValue(
                output,
                objective.expectedField
            );


        if (
            expectedValue === null ||
            expectedValue === undefined ||
            expectedValue === ""
        ) {
            return res.status(400).json({
                success: false,
                correct: false,
                message:
                    "The required information could not be found in the command output.",
            });
        }


        const studentAnswer =
            normalizeAnswer(answer);


        let correct = false;


        // ==================================================
        // ARRAY VALUES
        // ==================================================

        if (
            Array.isArray(
                expectedValue
            )
        ) {

            const studentParts =
                studentAnswer
                    .split(/[,\s]+/)
                    .map(item =>
                        normalizeAnswer(item)
                    )
                    .filter(Boolean);


            correct =
                studentParts.some(
                    studentValue =>
                        expectedValue.some(
                            expectedItem =>
                                normalizeAnswer(
                                    expectedItem
                                ) ===
                                studentValue
                        )
                );
        }


        // ==================================================
        // DATE VALUES
        // ==================================================

        else if (
            objective.expectedField ===
                "creationDate" ||
            objective.expectedField ===
                "updatedDate" ||
            objective.expectedField ===
                "expirationDate"
        ) {

            const studentDate =
                new Date(
                    answer.trim()
                );


            const expectedDate =
                new Date(
                    String(
                        expectedValue
                    ).trim()
                );


            if (
                !Number.isNaN(
                    studentDate.getTime()
                ) &&
                !Number.isNaN(
                    expectedDate.getTime()
                )
            ) {

                correct =
                    studentDate.getUTCFullYear() ===
                        expectedDate.getUTCFullYear() &&

                    studentDate.getUTCMonth() ===
                        expectedDate.getUTCMonth() &&

                    studentDate.getUTCDate() ===
                        expectedDate.getUTCDate();

            } else {

                correct =
                    normalizeAnswer(
                        answer
                    ) ===
                    normalizeAnswer(
                        expectedValue
                    );
            }
        }


        // ==================================================
        // NORMAL TEXT
        // ==================================================

        else {

            correct =
                studentAnswer ===
                normalizeAnswer(
                    expectedValue
                );
        }


        // ==================================================
        // GET / CREATE USER PROGRESS
        // ==================================================

        let progress =
            await LabProgress.findOne({
                user: req.user._id,
                lab: lab._id,
            });


        if (!progress) {

            progress =
                await LabProgress.create({
                    user: req.user._id,
                    lab: lab._id,
                    objectives: [],
                });
        }


        // ==================================================
        // UPDATE OBJECTIVE PROGRESS
        // ==================================================

        let objectiveProgress =
            progress.objectives.find(
                item =>
                    item.objectiveIndex ===
                    Number(objectiveIndex)
            );


        if (!objectiveProgress) {

            progress.objectives.push({
                objectiveIndex:
                    Number(objectiveIndex),

                completed:
                    correct,

                answer:
                    correct
                        ? answer
                        : "",
            });

        } else {

            objectiveProgress.completed =
                correct;

            objectiveProgress.answer =
                correct
                    ? answer
                    : "";
        }


        // ==================================================
        // CHECK ALL OBJECTIVES
        // ==================================================

const allObjectiveIndexes =
    lab.objectives.map(
        (_, index) => index
    );

const allCompleted =
    allObjectiveIndexes.every(index => {

        const objectiveProgress =
            progress.objectives.find(
                item =>
                    item.objectiveIndex === index
            );

        return (
            objectiveProgress?.completed === true
        );
    });

if (allCompleted) {

    progress.completed = true;

    progress.completedAt = new Date();

} else {

    progress.completed = false;

    progress.completedAt = null;
}


        await progress.save();


        // ==================================================
        // RESPONSE
        // ==================================================

        res.json({

            success: true,

            correct,

            expectedField:
                objective.expectedField,

            correctAnswer:
                correct
                    ? undefined
                    : expectedValue,

            progress: {
                completed:
                    progress.completed,

                objectives:
                    progress.objectives,

                completedObjectives:
                    progress.objectives.filter(
                        item =>
                            item.completed
                    ).length,
            },

            message: correct
                ? "Correct answer."
                : "Incorrect answer. Review the command output and try again.",
        });

    });

// ======================================================
// RESET USER LAB PROGRESS
// ======================================================

const resetLabProgress = asyncHandler(async (req, res) => {

    const lab = await Lab.findOne({
        _id: req.params.id,
        isActive: true,
    });

    if (!lab) {
        return res.status(404).json({
            success: false,
            message: "Lab not found",
        });
    }

    await LabProgress.findOneAndDelete({
        user: req.user._id,
        lab: lab._id,
    });

    res.json({
        success: true,
        message: "Lab progress reset successfully.",
    });
});
// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getLabs,
    getLabById,
    evaluateLabAnswer,
    resetLabProgress,
};