import { Router } from "express";

import QuestionController from "../controllers/question.controller.js";

const router = Router();
const questionController = new QuestionController();

router.get("/", questionController.getQuestions);

export default router;
