module.exports = function (sequelize, DataTypes) {
    return sequelize.define('removedQuiz',
        {
            quizId: {
                type: DataTypes.INTEGER
            }
        });
};