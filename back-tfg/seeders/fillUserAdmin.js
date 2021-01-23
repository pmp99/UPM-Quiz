'use strict';

var crypt = require('../helpers/crypt');


module.exports = {
    up(queryInterface, Sequelize) {

        return queryInterface.bulkInsert('users', [
            {
                username: 'Admin',
                password: crypt.encryptPassword('1234', 'admin'),
                salt: 'admin',
                isAdmin: true,
                createdAt: new Date(), updatedAt: new Date()
            }
        ]);
    },

    down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    }
};