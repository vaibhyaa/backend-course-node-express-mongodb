import { matchedData } from "express-validator";
import User from "../../models/user.model.js";

export const createUser = async (req, res) => {
  // using validateRequest middleware for this
  // validation (always do brfore any processing of data in backend )
  // const result = validationResult(req);
  // // if errors are not present the result.isEmpty() will be true and convert to false by ! so block code will not execute and it will move forward to the next code
  // // if error are their then result.isEmpty() will be false and convert to true by ! so block code will execute
  // // if errors are not present the result.isEmpty() will be true and convert to false by ! so block code will not execute and it will move forward to the next code

  // this all validation we can done in validation check just like name , age
  // extra safety: if body not parsed

  // which contains only fields that were part of your validation chain ✅
  const newUserBody = matchedData(req);
  // console.log(newUserBody);
  // “Create a new user object using the data from request body”
  // and always user this newUser not the reqbodyobject

  // extra safety: if body not parsed
  if (!newUserBody) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing. Make sure express.json() is used.",
    });
  }
  const newUser = new User(newUserBody);

  try {
    // this is the findOne It searches the MongoDB collection and returns:
    // one matching document if found ✅
    // null if not found ❌
    const existingUser = await User.findOne({
      phoneNumber: newUser.phoneNumber,
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }
    // save data in database function
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User successfully created",
      data: newUser,
    });
  } catch (error) {
    // console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
