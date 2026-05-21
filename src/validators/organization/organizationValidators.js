// Валідація форми створення організації
import { body } from "express-validator";

export const createOrganizationValidation = [
  // Перевірка назви організації
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Name must be between 2 and 255 characters"),

  // Перевірка опису
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),

  // Перевірка URL сайту
  body("websiteUrl")
    .optional({ nullable: true, checkFalsy: true })
    .isURL({
      protocols: ["https"],
      require_protocol: true,
    })
    .withMessage("Website URL must be a valid HTTPS URL"),

  // Перевірка масиву категорій
  body("categoryIds")
    .notEmpty()
    .withMessage("Category IDs are required")
    .isArray({ min: 1, max: 5 })
    .withMessage("Category IDs must contain from 1 to 5 items")
    .bail(),

  // Перевірка кожного ID категорії
  body("categoryIds.*")
    .isInt({ min: 1 })
    .withMessage("Each category ID must be a positive integer"),
];
