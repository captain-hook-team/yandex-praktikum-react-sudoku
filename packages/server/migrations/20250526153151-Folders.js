/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Folders', {
      folder_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      folder_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      folder_descr: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      topics_count: {
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
