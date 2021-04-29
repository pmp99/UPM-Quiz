'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'players',
            'userId',
            {type: Sequelize.INTEGER}
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('players', 'userId');
    }
};