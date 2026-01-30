import jwt from "jsonwebtoken";
import { signupSchema, loginSchema } from "./schema.js";

// ------------------------------ Validate Sign up ------------------------------
export const validateSignup = (request, response, next) => {
  const result = signupSchema.safeParse(request.body);

  if (!result.success) {
    const firstError = result.error.issues[0];

    return response.status(400).json({
      success: false,
      field: firstError.path[0],
      message: firstError.message,
    });
  }

  request.validatedData = result.data;
  next();
};

// ------------------------------ Validate Log in ------------------------------
export const validateLogin = (request, response, next) => {
  const result = loginSchema.safeParse(request.body);

  if (!result.success) {
    const firstError = result.error.issues[0];

    return response.status(400).json({
      success: false,
      field: firstError.path[0],
      message: firstError.message,
    });
  }

  request.validatedData = result.data;
  next();
};

// ------------------------------ Authenticate Token ------------------------------
export const authenticateToken = (request, response, next) => {
  const token = request.cookies.token;

  if (!token) {
    return response.json({ success: false, message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    request.user = verified;

    next();
  } catch (error) {
    response.clearCookie("token");
    response.status(400).json({ success: false, message: "Invalid Token" });
  }
};
