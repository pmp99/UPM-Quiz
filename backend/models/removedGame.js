module.exports = function (sequelize, DataTypes) {
    return sequelize.define('removedGame',
        {
            gameId: {
                type: DataTypes.INTEGER
            }
        });
};