const express = require('express');
const router = express.Router();
const User = require('../queries/userQueries');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../configurations/config');

// Register
router.post('/register', (req, res) => {
    let newUser = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };
    User.addUser(newUser, (err, user) => {
        if(err) res.json({success: false, msg: 'Failed to register user'});
        res.json({
            success: true, 
            user: {
                name: user.name,
                email: user.email,
                username: user.username
            }, 
            msg: 'User registered!'
        });
    });
    return res;
});

// Authenticate
router.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({success: false, msg: 'User not found!'});
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        name: user.name,
                        email: user.email,
                        username: user.username
                    } 
                });
            } else res.json({success: false, msg: "Wrong Password!!"});
        });
    });

    return res;
});

// Profile
router.get('/profile', passport.authenticate("jwt", {session: false}), (req, res) => {
    return res.json({user: req.user});
});

router.post('/profile/updatePassword', (req, res) => {
    const currentCandidatePassword = req.body.currentPassword;
    const currentPassword = req.body.user.password;
    const newPassword = req.body.newPassword;
    User.comparePassword(currentCandidatePassword, currentPassword, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
            User.updatePassword(req.body.user, newPassword, (err, result) => {
                if(err) throw err;
                res.json({success: true, msg: 'Password updated.'});
            })
        }
        else res.json({success: false, msg: 'Current password entered is Invalid!'});
    })
    return res;
})

module.exports = router;