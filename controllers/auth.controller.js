import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import db from "../models/index.js";
import generateToken from "../utils/generateToken.js";

import UserFactory from "../models/user.js";

const { sequelize, Sequelize } = db;

const User = UserFactory(sequelize, Sequelize.DataTypes);

class AuthController {
  async signup(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error) => ({ message: error.msg })),
        });
      }
      const { username, email, password } = req.body;

      const existedUser = await User.findOne({ where: { email, username } });

      if (existedUser) {
        return res
          .status(400)
          .json({ errors: [{ message: "User already exists" }] });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPswd = await bcrypt.hash(password, salt);

      const user = await User.create({
        username,
        email,
        password: hashedPswd,
      });

      const token = generateToken(user.id);

      return res.status(201).json({ message: "User Created", token });
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error) => ({ message: error.msg })),
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: "User not found" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid credentials" }] });
      }

      const token = generateToken(user.id);

      return res.status(200).json({ message: "User Logged In", token });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
