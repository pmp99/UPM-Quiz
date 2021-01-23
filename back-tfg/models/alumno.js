// Definition of the Alumno model:

module.exports = function (sequelize, DataTypes) {
    const Alumno = sequelize.define('alumno', {
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
            position: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            userId: {
                type: DataTypes.INTEGER,
                defaultValue: null
            },
            aciertos: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        });

    return Alumno;
};