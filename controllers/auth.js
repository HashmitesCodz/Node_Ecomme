const User = require("../models/user")
const jwt = require("jsonwebtoken")
const expressJwt = require('express-jwt')
const {errorHandler} = require("../helpers/dbErrorHandler")

exports.signup = (req, res)=>{
    const user = new User(req.body)
    user.save((err, user)=>{
            if(err){
                return res.status(400).json({
                    err: errorHandler(err)
                });
            }
            user.salt = undefined
            user.hashed_password = undefined
            res.json({user})
        }
    )
}

exports.signin = (req, res)=>{
    const {email, password} = req.body
    User.findOne({email}, (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User with that email could not be found!"
            });
        }
        // Matching email and password
        // create authenticate method in user.model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and Password do not match!"
            })
        }
        // generating a signed token
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
        //  --sending to frontend
        const {_id, name, email, role} = user
        return res.json({token, user:{_id, name, email, role}})
    })
}

exports.signout = function(req, res){
    res.clearCookie("t");
    res.json({message:"Signout Successful"})
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ['sha1', 'RS256', 'HS256'],
});

exports.isAuth = (req, res, next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
}

exports.isAdmin = (req, res, next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error:"Admin resource! Access denied"
        });
    }
    next();
}