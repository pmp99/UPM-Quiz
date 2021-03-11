const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');

exports.allowConections = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

exports.createUser = (req, res, next) => {
    const {username, email, password} = req.body;
    models.user.findOne({where: {username: username}})
        .then(user => {
            if (user !== null) {
                res.send("El nombre de usuario ya existe");
            } else {
                models.user.findOne({where: {email: email}})
                    .then(user => {
                        if (user !== null) {
                            res.send("El correo electrónico ya está en uso");
                        } else {
                            const user = models.user.build({
                                username,
                                password,
                                email
                            });
                            user.save({fields: ["username", "password", "email", "salt"]})
                                .then(user => {
                                    res.send(true)
                                })
                                .catch(Sequelize.ValidationError, error => {
                                    res.send("Error");
                                })
                                .catch(error => {
                                    req.flash('error', 'Error al crear el usuario: ' + error.message);
                                    res.send("Ha habido un error al procesar los datos");
                                    next(error);
                                });
                        }
                    })
            }
        })
}

exports.index = (req, res, next) => {
    models.user.findAll({include: models.quiz})
    .then(users => {
        res.send(users)
    })
    .catch(error => next(error));
};

exports.viewUser = (req, res, next) => {
    const id = req.params.id;
    models.user.findByPk(id)
    .then(user => {
        res.send(user)
    })
    .catch(error => next(error));
}

exports.edit = (req, res, next) => {
    const id = req.params.id;
    const {username, email} = req.body;
    models.user.findByPk(id)
    .then(user => {
        user.username = username;
        user.email = email;
        user.save({fields: ["username", "password", "email", "salt"]})
        .then(user => {
            res.send(user)
        })
    })
    .catch(error => next(error));
}

exports.deleteUser = (req, res, next) => {
    const id = req.params.id;
    models.user.destroy({where: {id: id}})
    models.quiz.destroy({where: {userId: id}, include: models.pregunta})
    .then(user => {
        res.send(true)
    })
    .catch(error => next(error));
}

