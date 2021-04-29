// Definition of the Player model:

module.exports = function (sequelize, DataTypes) {
    const Player = sequelize.define('player', {
            username: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Username must not be empty."}}
            },
            score: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            roundScore: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            answerSubmitted: {
                type: DataTypes.INTEGER
            },
            position: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            rightAnswers: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        });

    return Player;
};