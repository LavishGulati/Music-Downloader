var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');

var User = require('../models/user');

router.use(bodyParser.json());

/* GET users listing. */
router.post('/signup', function(req, res, next){
    User.register(new User({username: req.body.email,
        email: req.body.email,
        name: req.body.name
    }),
    req.body.password, (err, user) => {
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
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

router.post('/login', function(req, res, next){
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

module.exports = router;
