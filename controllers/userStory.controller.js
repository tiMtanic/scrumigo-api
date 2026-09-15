import UserStory from "../models/userStory.model.js";
import Sprint from "../models/sprint.model.js";

export const getUserStories = async (req, res, next) => {
  try {
    const result = await UserStory.find();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserStory = async (req, res, next) => {
  try {
    const result = await UserStory.findOne({ _id: req.params.userStoryId });

    if (!result) {
      return res.sendStatus(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createUserStory = async (req, res, next) => {
  const { sprintId, title, description, storyPoints } = req.body;

  try {
    if (!title) {
      return res.status(400).json({
        errorMessage: "title is required",
      });
    }

    const lastUserStory = await UserStory.findOne().sort({
      userStoryNumber: -1,
    });

    const lastUsedUserStoryNumber = lastUserStory?.userStoryNumber ?? 0;
    const userStoryNumber = lastUsedUserStoryNumber + 1;

    // Get UserId from payload
    const createdBy = req.payload._id;

    const result = await UserStory.create({
      userStoryNumber,
      sprintId,
      title,
      description,
      storyPoints,
      createdBy,
    });

    if (sprintId) {
      await Sprint.findByIdAndUpdate(sprintId, {
        $push: {
          userStories: result._id,
        },
      });
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserStory = async (req, res, next) => {
  const { sprintId, title, description, storyPoints } = req.body;

  try {
    if (!title) {
      return res.status(400).json({
        errorMessage: "title is required",
      });
    }

    const oldUserStory = await UserStory.findById(req.params.userStoryId);

    if (!oldUserStory) {
      return res.sendStatus(404);
    }

    const result = await UserStory.findByIdAndUpdate(
      req.params.userStoryId,
      {
        sprintId,
        title,
        description,
        storyPoints,
      },
      {
        runValidators: true,
        returnDocument: "after",
      },
    );

    if (String(oldUserStory.sprintId) !== String(sprintId)) {
      if (oldUserStory.sprintId) {
        await Sprint.findByIdAndUpdate(oldUserStory.sprintId, {
          $pull: {
            userStories: result._id,
          },
        });
      }

      if (sprintId) {
        await Sprint.findByIdAndUpdate(sprintId, {
          $push: {
            userStories: result._id,
          },
        });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUserStory = async (req, res, next) => {
  try {
    const result = await UserStory.findByIdAndDelete(req.params.userStoryId);

    if (!result) {
      return res.sendStatus(404);
    }

    if (result.sprintId) {
      await Sprint.findByIdAndUpdate(result.sprintId, {
        $pull: {
          userStories: result._id,
        },
      });
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};