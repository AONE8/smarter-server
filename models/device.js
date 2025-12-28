import { Model } from "sequelize";

const DeviceFactory = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      Device.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }

  Device.init(
    {
      name: DataTypes.STRING,
      url: DataTypes.STRING,
      image: DataTypes.STRING,
      type: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      vendor: DataTypes.STRING,

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
        },
      },
    },
    {
      sequelize,
      modelName: "Device",
    }
  );

  return Device;
};

export default DeviceFactory;
