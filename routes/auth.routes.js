import { Router } from "express";
import { body } from "express-validator";

import AuthController from "../controllers/auth.controller.js";

const router = Router();
const authController = new AuthController();

router.post(
  "/signup",
  [
    body("username", "Username must be at least 3 characters")
      .trim()
      .isLength({ min: 3 }),
    body(
      "username",
      "Username must have only latin characters, underscore and digits"
    )
      .trim()
      .matches(/^[a-zA-Z0-9_]+$/),
    body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    body("password", "Password must be at least 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      }),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    body("password", "Password must be at least 6 characters")
      .trim()
      .isLength({ min: 6 }),
  ],
  authController.login
);

export default router;
