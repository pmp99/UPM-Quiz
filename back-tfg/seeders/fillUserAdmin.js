'use strict';

module.exports = {
    up(queryInterface, Sequelize) {

        return queryInterface.bulkInsert('users', [
            {
                id: 2,
                name: 'Pablo Montes',
                email: 'montespablo99@gmail.com',
                isAdmin: true,
                createdAt: new Date(), updatedAt: new Date()
            }
        ]);
    },

    down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    }
};