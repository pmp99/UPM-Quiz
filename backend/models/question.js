module.exports = function (sequelize, DataTypes) {
    return sequelize.define('question',
        {
            question: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Question must not be empty"}}
            },
            answer0: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Answer must not be empty"}}
            },
            answer1: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Answer must not be empty"}}
            },
            answer2: {
                type: DataTypes.STRING,
            },
            answer3: {
                type: DataTypes.STRING,
            },
            correctAnswer: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "You must choose the correct answers"}}
            },
            time: {
                type: DataTypes.INTEGER,
                validate: {notEmpty: {msg: "You must choose the time"}}
            },
            image: {
                type: DataTypes.STRING
            }
        });
};
