// | Method | Purpose        | Behavior                                                                               |
// | ------ | -------------- | -------------------------------------------------------------------------------------- |
// | PUT    | Full update    | Replace the **entire resource** with new data. Missing fields may be reset or cleared. |
// | PATCH  | Partial update | Update **only the provided fields**, keep everything else intact.                      |

import { matchedData } from "express-validator";
import User from "../../models/user.model.js";

export const updateUserFull = async (req, res) => {
  try {
    const userId = req.userId; // from middleware
    const bodyData = matchedData(req, { locations: ["body"] });

    // console.log(userId, bodyData);

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
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
