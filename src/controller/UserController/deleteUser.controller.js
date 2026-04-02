import User from "../../models/user.model.js";

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.deleteOne({ id: userId });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
