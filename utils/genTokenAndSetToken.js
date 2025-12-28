import { sign } from "jsonwebtoken";
import { config } from "dotenv";

config();

const genTokenAndSetCookies = (userId, res) => {
  const token = sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1.5h",
  });

  res.cookie("jwt", token, {
    maxAge: 1.5 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export default genTokenAndSetCookies;
