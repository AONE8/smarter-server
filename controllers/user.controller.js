import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import db from "../models/index.js";
import UserFactory from "../models/user.js";

const User = UserFactory(db.sequelize, db.Sequelize.DataTypes);

class UserController {
  async getUser(req, res) {
    return res
      .status(200)
      .json({ username: req.user.username, email: req.user.email });
  }

  async updateUser(req, res, next) {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({
          errors: result.array().map((error) => ({ message: error.msg })),
        });
      }

      const { username, email } = req.body;

      const [affectedRows, [updatedUser]] = await User.update(
        { username, email },
        { where: { id: req.user.id }, returning: true }
      );

      if (!affectedRows) {
        return res
          .status(400)
          .json({ errors: [{ message: "User not updated" }] });
      }

      return res.status(200).json({
        message: "User Updated",
        data: { username: updatedUser.username, email: updatedUser.email },
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({
          errors: result.array().map((error) => ({ message: error.msg })),
        });
      }

      const { password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPswd = await bcrypt.hash(password, salt);

      const [affectedRows] = await User.update(
        { password: hashedPswd },
        { where: { id: req.user.id } }
      );

      if (!affectedRows) {
        return res
          .status(400)
          .json({ errors: [{ message: "User's Password Not Updated" }] });
      }

      return res.status(200).json({
        message: "User's Password Updated",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({
          errors: result.array().map((error) => ({ message: error.msg })),
        });
      }

      await req.user.destroy();

      return res.status(200).json({ message: "User Deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
