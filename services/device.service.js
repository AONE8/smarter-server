import fs from "fs/promises";
import path from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";

import Mapper from "../utils/mapper.js";
import stringifyIntoQuery from "../utils/stringifyIntoQuery.js";
import searchProduct from "../utils/searchProduct.js";

config({
  path: "../.env",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DeviceService {
  static async getDevice(resultBody, deviceType) {
    const questionFilePath = path.join(
      __dirname,
      "..",
      "data",
      "questions",
      `${deviceType}.json`
    );

    const queryFilePath = path.join(
      __dirname,
      "..",
      "data",
      "queries",
      `${deviceType}.json`
    );

    const cleanResultBodyArr = Object.entries(resultBody.data).filter(
      ([_, value]) => value
    );

    const cleanResultBody = Object.fromEntries(cleanResultBodyArr);

    const question = await fs.readFile(questionFilePath, "utf8");
    const query = await fs.readFile(queryFilePath, "utf8");

    const { questions } = JSON.parse(question);
    const queryObjArr = JSON.parse(query);

    const inputArr = [];

    questions.forEach((q) => {
      const { name, answers } = q;
      const answerArr = Array.isArray(answers)
        ? answers
        : answers[resultBody.lang];
      inputArr.push({ [name]: [...answerArr] });
    });

    const mapper = Mapper.createArrayMapper(inputArr, queryObjArr);

    for (let i = 0; i < inputArr.length; i++) {
      mapper.build(
        Object.keys(inputArr[i])[0],
        Object.keys(queryObjArr[i])[0],
        (val1, val2) => [val1, val2],
        i
      );
    }

    const resultObj = mapper.map(cleanResultBody);

    const resultString = stringifyIntoQuery(resultObj);

    const result = await searchProduct(resultString, deviceType);

    return result;
  }
}

export default DeviceService;
