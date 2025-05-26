'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Topics', {
      topic_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      folder_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'folder',
          key: 'folder_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      topic_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      topic_descr: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      messages_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
    await queryInterface.dropTable('Topics');
    await queryInterface.dropTable('Folders');
  },
};
