'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'removedQuizzes',
            'userId',
            {type: Sequelize.INTEGER}
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('removedQuizzes', 'userId');
    }
};