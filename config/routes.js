module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/auth/signup', users.signup);
    app.post('/auth/signin', users.signin);
    app.get('/auth/signout', users.signout);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/#!/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/#!/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
