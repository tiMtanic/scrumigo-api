import User from "../models/user.model.js";

export const getUser = async (req, res, next) => {
  try {
    const result = await User.findOne({
      _id: req.params.userId,
    });

    if (!result) {
      return res.sendStatus(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};