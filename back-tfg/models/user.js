// Definition of the User model:

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        name:{
            type: DataTypes.STRING
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            validate: {notEmpty: {msg: "Email must not be empty."}}
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
};