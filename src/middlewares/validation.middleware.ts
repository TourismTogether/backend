import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { ValidationError } from "./error-handler";

/**
 * Middleware to handle validation errors
 */
export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err: any) => ({
      field: err.type === "field" ? err.path : "unknown",
      message: err.msg,
      value: err.type === "field" ? err.value : undefined,
    }));

    // Create a detailed error message
    const errorDetails = errorMessages.map((e: any) => `${e.field}: ${e.message}`).join(", ");
    const error = new ValidationError(`Validation failed: ${errorDetails}`, "VALIDATION_ERROR");
    (error as any).details = errorMessages; // Attach details for potential use
    throw error;
  }
  next();
}

/**
 * Common validation rules
 */
export const commonValidators = {
  // UUID validation
  uuid: (field: string = "id") =>
    param(field)
      .isUUID()
      .withMessage(`${field} must be a valid UUID`),

  // Email validation
  email: (field: string = "email") =>
    body(field)
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),

  // Password validation
  password: (field: string = "password", minLength: number = 6) =>
    body(field)
      .isLength({ min: minLength })
      .withMessage(`Password must be at least ${minLength} characters`)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .optional(),

  // Username validation
  username: (field: string = "username") =>
    body(field)
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username can only contain letters, numbers, and underscores"),

  // Required string field
  requiredString: (field: string, minLength: number = 1, maxLength?: number) => {
    let validator = body(field)
      .trim()
      .notEmpty()
      .withMessage(`${field} is required`)
      .isLength({ min: minLength })
      .withMessage(`${field} must be at least ${minLength} characters`);

    if (maxLength) {
      validator = validator.isLength({ max: maxLength }).withMessage(
        `${field} must be at most ${maxLength} characters`
      );
    }

    return validator;
  },

  // Optional string field
  optionalString: (field: string, maxLength?: number) => {
    let validator = body(field).trim().optional();

    if (maxLength) {
      validator = validator.isLength({ max: maxLength }).withMessage(
        `${field} must be at most ${maxLength} characters`
      );
    }

    return validator;
  },

  // Positive number
  positiveNumber: (field: string) =>
    body(field)
      .isFloat({ min: 0 })
      .withMessage(`${field} must be a positive number`),

  // Integer
  integer: (field: string) =>
    body(field)
      .isInt()
      .withMessage(`${field} must be an integer`),

  // Date validation
  date: (field: string) =>
    body(field)
      .isISO8601()
      .withMessage(`${field} must be a valid ISO 8601 date`)
      .toDate(),

  // URL validation
  url: (field: string) =>
    body(field)
      .isURL()
      .withMessage(`${field} must be a valid URL`)
      .optional(),

  // Phone number validation (basic)
  phone: (field: string = "phone") =>
    body(field)
      .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
      .withMessage("Invalid phone number format")
      .optional(),
};

/**
 * Trip-specific validators
 */
export const tripValidators = {
  createTrip: [
    commonValidators.requiredString("title", 1, 200),
    commonValidators.optionalString("description", 2000),
    commonValidators.requiredString("destination_id"),
    commonValidators.date("start_date"),
    commonValidators.date("end_date"),
    commonValidators.positiveNumber("total_budget").optional(),
    commonValidators.integer("difficult").optional(),
    commonValidators.positiveNumber("distance").optional(),
    commonValidators.optionalString("password", 100), // For private trips
    handleValidationErrors,
  ],

  updateTrip: [
    commonValidators.uuid("id"),
    commonValidators.optionalString("title", 200),
    commonValidators.optionalString("description", 2000),
    commonValidators.date("start_date").optional(),
    commonValidators.date("end_date").optional(),
    commonValidators.positiveNumber("total_budget").optional(),
    commonValidators.integer("difficult").optional(),
    commonValidators.positiveNumber("distance").optional(),
    handleValidationErrors,
  ],

  tripId: [
    commonValidators.uuid("id"),
    handleValidationErrors,
  ],
};

/**
 * Auth-specific validators
 */
export const authValidators = {
  signUp: [
    commonValidators.email("email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    commonValidators.username("username"),
    commonValidators.optionalString("full_name", 100),
    commonValidators.phone("phone"),
    commonValidators.url("avatar_url"),
    handleValidationErrors,
  ],

  signIn: [
    body("email")
      .optional({ checkFalsy: true })
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),
    body("username")
      .optional({ checkFalsy: true })
      .trim()
      .notEmpty()
      .withMessage("Username cannot be empty"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    // Custom validation: either email or username must be provided
    body().custom((value) => {
      if (!value.email && !value.username) {
        throw new Error("Either email or username is required");
      }
      return true;
    }),
    handleValidationErrors,
  ],
};

/**
 * User-specific validators
 */
export const userValidators = {
  userId: [
    commonValidators.uuid("id"),
    handleValidationErrors,
  ],

  updateUser: [
    commonValidators.optionalString("full_name", 100),
    commonValidators.phone("phone"),
    commonValidators.url("avatar_url"),
    handleValidationErrors,
  ],
};
