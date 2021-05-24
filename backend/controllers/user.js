const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');

exports.login = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    models.user.findByPk(id)
        .then(user => {
            if (user !== null) {
                if (user.name !== name || user.email !== email) {
                    user.name = name
                    user.email = email
                    user.save({fields: ["name", "email"]})
                        .then(user => {
                            res.send(user)
                        })
                        .catch(error => next(error))
                } else {
                    user.changed('name', true)
                    user.save()
                        .then(user => {
                            res.send(user)
                        })
                        .catch(error => next(error))
                }
            } else {
                const user = models.user.build({
                    id,
                    name,
                    email
                });
                user.save({fields: ["id", "name", "email"]})
                    .then(user => {
                        res.send(user)
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
}


exports.getUsers = (req, res, next) => {
    models.user.findAll({include: models.quiz})
    .then(users => {
        res.send(users)
    })
    .catch(error => next(error));
}


exports.deleteUser = (req, res, next) => {
    const id = req.params.userId;
    models.user.destroy({where: {id: id}})
    .then(() => {
        res.send(true)
    })
    .catch(error => next(error));
}

