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
            status:{
                type: Sequelize.INTEGER
            },
            currentQuestion: {
                type: Sequelize.INTEGER
            },
            nQuestions: {
                type: Sequelize.INTEGER
            },
            questionStartedAt: {
                type: Sequelize.INTEGER
            },
            locked:{
                type: Sequelize.BOOLEAN
            },
            courseId: {
                type: Sequelize.INTEGER
            },
            assignmentId: {
                type: Sequelize.INTEGER
            },
            min: {
                type: Sequelize.INTEGER
            },
            max: {
                type: Sequelize.INTEGER
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