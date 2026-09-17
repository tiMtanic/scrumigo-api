import Task from "../models/task.model.js";
import UserStory from "../models/userStory.model.js";
import { connectionManager } from "../realtime/connectionManager.js";

export const getTasks = async (req, res, next) => {
  try {
    const result = await Task.find().populate("assigneeId");

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const result = await Task.findOne({
      _id: req.params.taskId,
    }).populate("assigneeId");

    if (!result) {
      return res.sendStatus(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, userStoryId, assigneeId } = req.body;

    if (!title || !status || !userStoryId) {
      return res.status(400).json({
        errorMessage: "title, status and userStoryId are required",
      });
    }

    const userStory = await UserStory.findById(userStoryId);

    if (!userStory) {
      return res.status(404).json({
        errorMessage: "User story not found",
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
      assigneeId,
    });

    await UserStory.findByIdAndUpdate(userStoryId, {
      $push: {
        tasks: result._id,
      },
    });

    const populatedTask = await Task.findById(result._id).populate(
      "assigneeId",
    );

    connectionManager.broadcast({
      type: "task.created",
      payload: {
        task: populatedTask,
      }
    });

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !status) {
      return res.status(400).json({
        errorMessage: "title and status are required",
      });
    }

    const oldTask = await Task.findById(req.params.taskId);

    if (!oldTask) {
      return res.sendStatus(404);
    }

    const assigneeId =
      status === "todo"
        ? null
        : oldTask.status === "todo" && status === "in_progress"
          ? req.payload._id
          : oldTask.assigneeId;

    const result = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        title,
        description,
        status,
        assigneeId,
      },
      {
        runValidators: true,
        returnDocument: "after",
      },
    ).populate("assigneeId");

    connectionManager.broadcast({
      type: "task.updated",
      payload: {
        task: result,
        previousStatus: oldTask.status,
      }
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.taskId);

    if (!result) {
      return res.sendStatus(404);
    }

    await UserStory.findByIdAndUpdate(result.userStoryId, {
      $pull: {
        tasks: result._id,
      },
    });

    connectionManager.broadcast({
      type: "task.deleted",
      payload: {
        taskId: result._id,
        userStoryId: result.userStoryId,
        taskNumber: result.taskNumber,
      }
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
