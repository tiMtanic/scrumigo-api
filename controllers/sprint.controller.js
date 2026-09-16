import Sprint from "../models/sprint.model.js";
import UserStory from "../models/userStory.model.js";

export const getSprints = async (req, res, next) => {
  try {
    const { populateUserStories } = req.query;

    let query = Sprint.find();

    if (populateUserStories === "true") {
      query = query.populate("userStories");
    }

    const result = await query;
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSprint = async (req, res, next) => {
  try {
    const { populateUserStories } = req.query;

    let query = Sprint.findById(req.params.sprintId);

    if (populateUserStories === "true") {
      query = query.populate("userStories");
    }

    const result = await query;

    if (!result) {
      return res.sendStatus(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createSprint = async (req, res, next) => {
  try {
    const { name, goal, startDate, endDate, status, userStories } = req.body;

    if (!startDate || !endDate || !status) {
      res.status(400).json({
        errorMessage: "startDate, endDate and status are required",
      });
    }

    const lastSprint = await Sprint.findOne().sort({ sprintNumber: -1 });
    const lastUsedSprintNumber = lastSprint?.sprintNumber ?? 0;
    const sprintNumber = lastUsedSprintNumber + 1;

    const result = await Sprint.create({
      sprintNumber,
      name,
      goal,
      startDate,
      endDate,
      status,
      userStories,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateSprint = async (req, res, next) => {
  try {
    const { name, goal, startDate, endDate, status, userStories } = req.body;

    if (!startDate || !endDate || !status) {
      res.status(400).json({
        errorMessage: "startDate, endDate and status are required",
      });
    }

    const result = await Sprint.findByIdAndUpdate(
      req.params.sprintId,
      {
        name,
        goal,
        startDate,
        endDate,
        status,
        userStories,
      },
      {
        runValidators: true,
        returnDocument: "after",
      },
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteSprint = async (req, res, next) => {
  try {
    await Sprint.findByIdAndDelete(req.params.sprintId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
