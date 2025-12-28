"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Devices", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
      },
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Devices");
}
