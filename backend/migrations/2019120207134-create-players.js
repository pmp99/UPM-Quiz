'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('players',
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    unique: true
                },
                username: {
                    type: Sequelize.STRING,
                    validate: {
                        notEmpty: {msg: "Username must not be empty."}
                    }
                },
                score: {
                    type: Sequelize.INTEGER
                },
                roundScore: {
                    type: Sequelize.INTEGER
                },
                answerSubmitted: {
                    type: Sequelize.INTEGER
                },
                position: {
                    type: Sequelize.INTEGER
                },
                rightAnswers: {
                    type: Sequelize.INTEGER
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            },
            {
                sync: {force: true}
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('players');
    }
};