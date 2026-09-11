import Sprint from "../models/sprint.model.js";

export const getSprints = async (req, res, next) => {
  try {
    const result = await Sprint.find();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSprint = async (req, res, next) => {
  try {
    const result = await Sprint.findOne({ _id: req.params.sprintId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createSprint = async (req, res, next) => {
  try {
    const { name, goal, startDate, endDate, status } = req.body;

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
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateSprint = async (req, res, next) => {
  try {
    const { name, goal, startDate, endDate, status } = req.body;

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
