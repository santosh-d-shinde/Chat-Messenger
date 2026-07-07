'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'hashToken', {
      type: Sequelize.STRING(128),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'hashTokenExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'hashToken');

    await queryInterface.removeColumn('Users', 'hashTokenExpiresAt');

    await queryInterface.removeColumn('Users', 'isVerified');
  }
};