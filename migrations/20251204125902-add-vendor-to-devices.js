"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Devices", "vendor", {
    type: Sequelize.STRING,
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Devices", "vendor", {
    type: Sequelize.STRING,
  });
}
