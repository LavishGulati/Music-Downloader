var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');

const cors = require('../cors');

var User = require('../models/user');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

router.get('/', cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {
    // console.log(req.query);
    User.findOne(req.query)
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});

router
.post('/signup', cors.corsWithOptions, function(req, res, next){
    User.register(new User({username: req.body.username}),
    req.body.password, (err, user) => {
        if(err){
            // User already exists
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            err.message = "* Username already exists"
            res.json({err: err});
        }
        else{
            if(req.body.name){
                user.name = req.body.name;
            }

            if(req.body.email){
                user.email = req.body.email;
            }

            user.save((err, user) => {

                if(err){
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                }

                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            });
        }
    });
});

router.post('/login', cors.corsWithOptions, function(req, res, next){
    passport.authenticate('local', (err, user, info) => {
        if(err){
            return next(err);
        }

        if(!user){
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: false,
                status: 'Login unsuccessful',
                err: info
            });
        }

        req.logIn(user, (err) => {
            if(err){
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    success: false,
                    status: 'Login unsuccessful',
                    err: "Could not login user"
                });
            }

            var token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: true,
                status: 'Login successful',
                token: token
            });

        });

    }) (req, res, next);
});

router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if(err){
            return next(err);
        }

        if(!user){
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({status: 'JWT invalid!', success: false, err: info});
        }
        else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({status: 'JWT valid!', success: true, user: user});
        }
    }) (req, res);
});

module.exports = router;
