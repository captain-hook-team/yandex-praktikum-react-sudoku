/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      message_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      topic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'topics',
          key: 'topic_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message_text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
    await queryInterface.dropTable('Topics');
    await queryInterface.dropTable('Folders');
  },
};
