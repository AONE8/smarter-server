import jwt from "jsonwebtoken";

import db from "../models/index.js";
import UserFactory from "../models/user.js";

const User = UserFactory(db.sequelize, db.Sequelize.DataTypes);

const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log(req.headers.authorization);

    if (!token) {
      return res
        .status(401)
        .json({ errors: [{ message: "Unauthorized - No Token Provided" }] });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res
        .status(401)
        .json({ errors: [{ message: "Unauthorized - Invalid Token" }] });
    }

    const user = await User.findByPk(decode.userId);

    if (!user) {
      return res
        .status(401)
        .json({ errors: [{ message: "Unauthorized - User Not Found" }] });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default protectRoute;
