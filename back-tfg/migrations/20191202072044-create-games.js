'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('games', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            accessId: {
                type: Sequelize.INTEGER
            },
            started:{
                type: Sequelize.BOOLEAN
            },
            currentQuestion: {
                type: Sequelize.INTEGER
            },
            quizName: {
                type: Sequelize.STRING
            },
            nQuestions: {
                type: Sequelize.INTEGER
            },
            locked:{
                type: Sequelize.BOOLEAN
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
        return queryInterface.dropTable('games');
    }
};