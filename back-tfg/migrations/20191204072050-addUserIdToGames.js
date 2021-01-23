'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'games',
            'userId',
            {type: Sequelize.INTEGER}
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('games', 'userId');
    }
};