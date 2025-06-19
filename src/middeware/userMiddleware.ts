import { Request, Response, NextFunction } from "express";
import joi, { any } from "joi";

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const schema = joi.object({
    name: joi.string().required().messages({
      "string.empty": "name cannot be empty",
      "any.required": "name is required",
    }),
    email: joi.string().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
    bvn: joi.string().required().messages({
      "string.empty": "bvn cannot be empty",
      "any.required": "bvn is required",
    }),
    password: joi.string().required().messages({
      "string.empty": "name password cannot be empty",
      "any.required": "Password is required.",
    }),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    const errors = error.details.map((detail: any) => ({
      field: detail.context.key,
      message: detail.message,
    }));
    res.status(422).json({
      message: "Validation error",
      success: false,
      errors,
    });
  }
};
