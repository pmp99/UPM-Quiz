'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pregunta', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING
      },
      answer0: {
        type: Sequelize.STRING
      },
      answer1: {
        type: Sequelize.STRING
      },
      answer2: {
        type: Sequelize.STRING
      },
      answer3: {
        type: Sequelize.STRING
      },
      correctAnswer: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.INTEGER
      },
      finished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      image: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pregunta');
  }
};