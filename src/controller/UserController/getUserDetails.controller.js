import User from "../../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    // fetch all documents from users collection
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req;
    const userDetails = await User.findOne({ id: Number(userId) });
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User details fetched successfullt",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserSorted = async (req, res) => {
  try {
    let { filter, value } = req.query;
    value = value.trim().toLowerCase();

    if (!filter && !value) {
      const users = await User.find().select("-password");

      return res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    }

    // if only one is provided -> bad request
    if ((filter && !value) || (!filter && value)) {
      return res.status(400).json({
        success: false,
        message: "Please provide both filter and value together",
      });
    }

    // build dynamic query object
    const queryObj = {};

    // if filtering by id
    if (filter === "id") {
      queryObj.id = Number(value);
    }

    // if filtering by name
    if (filter === "name") {
      queryObj.name = value;
    }
    // console.log(queryObj);

    const users = await User.find(queryObj).select("-password");

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
