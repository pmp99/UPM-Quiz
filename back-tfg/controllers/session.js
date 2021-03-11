const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');


// This variable contains the maximum inactivity time allowed without 
// making requests.
// If the logged user does not make any new request during this time, 
// then the user's session will be closed.
// The value is in milliseconds.
// 5 minutes.
const maxIdleTime = 5*60*1000;

exports.allowConections = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
}
//
// Middleware used to destroy the user's session if the inactivity time
// has been exceeded.
//
exports.deleteExpiredUserSession = (req, res, next) => {

    if (req.session.user ) { // There exista user's session
        if ( req.session.user.expires < Date.now() ) { // Expired
            delete req.session.user; // Logout
            req.flash('info', 'User session has expired.');
        } else { // Not expired. Reset value.
            req.session.user.expires = Date.now() + maxIdleTime;
        }
    }
    // Continue with the request
    next();
};


// Middleware: Login required.
//
// If the user is logged in previously then there will exists
// the req.session.user object, so I continue with the others
// middlewares or routes.
// If req.session.user does not exist, then nobody is logged,
// so I redirect to the login screen.
// I keep on redir which is my url to automatically return to
// that url after login; but if redir already exists then
// this value is maintained.
//
exports.loginRequired = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/session?redir=' + (req.param('redir') || req.url));
    }
};


// MW that allows to pass only if the logged useer in is admin.
exports.adminRequired = (req, res, next) => {

    const isAdmin = !!req.body.session.user.isAdmin;

    if (isAdmin) {
        next();
    } else {
        console.log('Prohibited route: the logged in user is not an administrator.');
        res.send(403);
    }
};

// MW that allows to pass only if the logged in user is:
// - admin
// - or is the user to be managed.
exports.adminOrMyselfRequired = (req, res, next) => {

    const isAdmin  = req.session.user.isAdmin;
    const isMyself = req.param.id === req.session.user.id;

    if (isAdmin || isMyself) {
        next();
    } else {
        console.log('Prohibited route: it is not the logged in user, nor an administrator.');
        res.send(403);
    }
};

// MW that allows to pass only if the logged in user is:
// - admin
// - and is not the user to manage.
exports.adminAndNotMyselfRequired = function(req, res, next){

    const isAdmin   = req.session.user.isAdmin;
    const isAnother = req.user.id !== req.session.user.id;

    if (isAdmin && isAnother) {
        next();
    } else {
        console.log('Prohibited route: the user is logged or is not an administrator.');
        res.send(403);    }
};




// POST /login   -- Create the session if the user authenticates successfully
exports.create = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    models.user.findByPk(id)
    .then(user => {
        if (user !== null) {
            res.send(user)
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
};


// DELETE /session   --  Close the session
exports.destroy = (req, res, next) => {
    delete req.session.user;
    res.redirect("/"); // redirect to login gage
};
