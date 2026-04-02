// this for the patch user
// means update only the fields which are provided

import { matchedData } from "express-validator";
import User from "../../models/user.model.js";

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    // const user=req.user;
    // console.log(userId);
    // console.log(user);

    const bodyData = matchedData(req, { locations: ["body"] });

    // Remove any attempt to change name or age
    delete bodyData.name;
    delete bodyData.age;
    // delete bodyData.phoneNumber;

    if (Object.keys(bodyData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { ...bodyData },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
