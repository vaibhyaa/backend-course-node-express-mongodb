// here is the perfect example of midleware :-
// as many route handler we have we need to write common code for validation , parsing , filtering , sorting etc. in every route handler
// for put,patch,delete,get
// export const validateUserIdMiddleware = (req, res, next) => {
import User from "../models/user.model.js";

export async function validateUserIdMiddleware(req, res, next) {
  try {
    const { userId } = req.params;

    const parsedId = Number(userId);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // Fetch user using your custom 'id' field
    const user = await User.findOne({ id: parsedId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to req
    req.user = user;
    req.userId = parsedId;

    next();
  } catch (error) {
    console.error("validateUserIdMiddleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// next() does not automatically pass any data to the next middleware or route handler, but we can attach data to the req object (like req.findUserByid) and it will be accessible in the next middleware or route handler as well because they all share the same req object in the request-response cycle.
// next() does take any argument, but it except an error object /null. If you pass an error object to next(), it will skip all remaining non-error handling middleware and route handlers and go directly to the error handling middleware. If you pass null or nothing to next(), it will simply pass control to the next middleware or route handler in the stack.
// next (new Error("Something went wrong") ) -> this will skip all remaining non-error handling middleware and route handlers and go directly to the error handling middleware
