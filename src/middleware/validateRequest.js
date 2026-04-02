import { validationResult } from "express-validator";

// const validateRequest = (req, res, next) => {
export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array().map((eachError) => ({
        message: eachError.msg,
      })),
    });
  }
  next();
}