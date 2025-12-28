import { Router } from "express";
import { body } from "express-validator";
import bcrypt from "bcryptjs";

import UserController from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = Router();
const userController = new UserController();

router.get("/", protectRoute, userController.getUser);
router.put(
  "/update-user",
  protectRoute,
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
  ],
  userController.updateUser
);
router.put(
  "/change-password",
  protectRoute,
  [
    body("password", "Password must be at least 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("password")
      .trim()
      .custom(async (value, { req }) => {
        const isMatch = await bcrypt.compare(value, req.user.password);
        if (isMatch) {
          throw new Error("New password cannot be the same as the old one.");
        }
        return true;
      }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      }),
  ],

  userController.changePassword
);
router.post(
  "/delete-account",
  protectRoute,
  [
    body("password", "Password must be at least 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("password")
      .trim()
      .custom(async (value, { req }) => {
        const isMatch = await bcrypt.compare(value, req.user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials.");
        }
        return true;
      }),
  ],
  userController.deleteAccount
);

export default router;
