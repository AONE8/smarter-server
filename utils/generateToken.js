import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

export default generateToken;
