import { Router } from "express";

import DeviceController from "../controllers/device.controller.js";

import protectRoute from "../middlewares/protectRoute.js";

const router = Router();

const deviceController = new DeviceController();

router.post("/:deviceType", protectRoute, deviceController.searchDevice);

router.get("/", protectRoute, deviceController.getAllDevices);

router.delete("/:deviceId", protectRoute, deviceController.deleteDevice);

export default router;
