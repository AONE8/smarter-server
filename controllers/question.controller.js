import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class QuestionController {
  async getQuestions(req, res, next) {
    try {
      const { device } = req.query;

      if (!device) {
        return res
          .status(400)
          .json({ errors: [{ message: "Device Type Not Found" }] });
      }

      const filePath = path.join(
        __dirname,
        "../data/questions",
        `${device}.json`
      );

      const fileContent = await fs.readFile(filePath, "utf8");

      return res.status(200).send(fileContent);
    } catch (error) {
      next(error);
    }
  }
}

export default QuestionController;
