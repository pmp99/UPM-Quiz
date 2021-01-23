module.exports = function (sequelize, DataTypes) {
    return sequelize.define('quiz',
        {
            name: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Name must not be empty."}}
            },
            timesPlayed: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        });
};