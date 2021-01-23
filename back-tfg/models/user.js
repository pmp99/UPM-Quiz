const crypt = require('../helpers/crypt');

// Definition of the User model:

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
            username: {
                type: DataTypes.STRING,
                unique: true,
                validate: {notEmpty: {msg: "Username must not be empty."}}
            },
            password: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Password must not be empty."}},
                set(password) {
                    // Random String used as salt.
                    this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
                    this.setDataValue('password', crypt.encryptPassword(password, this.salt));
                }
            },
            email:{
                type: DataTypes.STRING,
                unique: true,
                validate: {notEmpty: {msg: "Email must not be empty."}}
            },
            salt: {
                type: DataTypes.STRING,
                defaultValue: "aaaa"
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        });

    User.prototype.verifyPassword = function (password) {
        return crypt.encryptPassword(password, this.salt) === this.password;
    };

    return User;
};