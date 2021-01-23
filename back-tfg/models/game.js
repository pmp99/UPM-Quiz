module.exports = function (sequelize, DataTypes) {
    return sequelize.define('game',
        {
            accessId: {
                type: DataTypes.INTEGER,
                unique: true
            },
            started: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            currentQuestion: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            quizName: {
                type: DataTypes.STRING,
                defaultValue: ""
            },
            nQuestions: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            locked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        });
};