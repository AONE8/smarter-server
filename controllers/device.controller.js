import DeviceService from "../services/device.service.js";
import db from "../models/index.js";
import DeviceFactory from "../models/device.js";

const Device = DeviceFactory(db.sequelize, db.Sequelize.DataTypes);

const deviceTypeArr = ["smartphone", "laptop", "monoblock", "smartwatch"];

class DeviceController {
  async searchDevice(req, res, next) {
    try {
      const { deviceType } = req.params;

      const isDeviceType = deviceTypeArr.some((dT) => dT === deviceType);

      if (!isDeviceType)
        return res
          .status(404)
          .json({ errors: [{ message: "Invalid Device Type" }] });

      const reqBody = req.body;

      const device = await DeviceService.getDevice(reqBody, deviceType);

      if (!device)
        return res
          .status(404)
          .json({ errors: [{ message: "Device not found" }] });

      const createdDevice = await Device.create({
        name: device.name,
        url: device.productURL,
        image: device.imgURL,
        type: deviceType,
        price: device.price,
        vendor: device.vendor,
        userId: req.user.id,
      });

      if (!createdDevice)
        return res
          .status(400)
          .json({ errors: [{ message: "Device not created" }] });

      return res.status(200).json(device);
    } catch (error) {
      console.log("Error in device controller", error);
      next(error);
    }
  }

  async getAllDevices(req, res, next) {
    try {
      const userId = req.user.id;
      const devices = await Device.findAll({
        where: { userId },
        attributes: { exclude: ["userId", "updatedAt"] },
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({ devices });
    } catch (error) {
      next(error);
    }
  }

  async deleteDevice(req, res, next) {
    try {
      const { deviceId } = req.params;

      const device = await Device.findByPk(deviceId);

      if (!device)
        return res
          .status(404)
          .json({ errors: [{ message: "Device not found" }] });

      await device.destroy();

      return res.status(200).json({ message: "Device Deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export default DeviceController;
