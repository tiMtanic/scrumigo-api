import Task from "../models/task.model.js";

export const getTasks = async (req, res, next) => {
  try {
    const result = await Task.find();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const result = await Task.findOne({ _id: req.params.taskId });

    if (!result) {
      res.sendStatus(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, userStoryId } = req.body;

    if (!title || !status || !userStoryId) {
      res.status(400).json({
        errorMessage: "title, status and userStoryId are required",
      });
    }

    const lastTask = await Task.findOne().sort({
      taskNumber: -1,
    });
    const lastUsedTaskNumber = lastTask?.taskNumber ?? 0;
    const taskNumber = lastUsedTaskNumber + 1;

    const result = await Task.create({
      taskNumber,
      title,
      description,
      status,
      userStoryId,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, userStoryId, assigneeId } = req.body;

    if (!title || !status || !userStoryId) {
      res.status(400).json({
        errorMessage: "title, status and userStoryId are required",
      });
    }

    const result = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        title,
        description,
        status,
        userStoryId,
        assigneeId,
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

export const deleteTask = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
