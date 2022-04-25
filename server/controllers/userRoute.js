const api = require("express").Router()
const User = require("../models/userSchema")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userMiddleware = require("../utils/userMiddleware")
const tokenMiddleware = require("../utils/tokenMiddleware")
const JWT_SECRET = require("../utils/config").JWT_SECRET

api.get("/", tokenMiddleware.getBearer, async(req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const allUsers = await User.find({}).populate('qComments', {user: 0}).populate('questions', {user: 0}).populate('aComments', {user: 0}).populate('answers', {user: 0}) 
    res.status(200).json(allUsers)
})

api.get("/:id", tokenMiddleware.getBearer, async(req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)

    const user = await User.findById(req.params.id).populate('qComments', {user: 0}).populate('questions', {user: 0}).populate('aComments', {user: 0}).populate('answers', {user: 0}) 
    if(user === null) {
        const e = new Error("User may have been deleted or does not exist")
        e.name = "UnknownUserError"
        throw e
    }
    res.status(200).json(user)
})

api.post("/signup", userMiddleware.verifyUser, userMiddleware.verifyEmail, async (req, res, next) => {
    if(req.body.password.indexOf(req.body.username) !== -1 || req.body.password.indexOf(req.body.email) !== -1) {
        const e = new Error("Username/Email cannot appear in password")
        e.name = "Bad password"
        throw e
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    const user = new User({
        username: req.body.username,
        passwordHash,
        email: req.body.email,
    })
    const saveUser = await user.save()
    res.status(201).json(saveUser)
})

api.post("/login/:reg", userMiddleware.verifyEmail, userMiddleware.verifyPasswordExist, async (req, res, next) => {
    if(req.params.reg === "user") {
        const user = await User.findOne({email: req.body.email})
        if(user === undefined || user === null) {
            const e = new Error("Invalid Email")
            e.name = "InvalidEmailError"
            throw e
        }
        const passwordHash = user.passwordHash
        const verification = await bcrypt.compare(req.body.password, passwordHash)
        if(!verification) {
            const e = new Error("Invalid Password")
            e.name = "InvalidPasswordError"
            throw e
        }
        const userInfo = {
            email: user.email,
            username: user.username,
            id: user._id,
            registered: true
        }
        const token = jwt.sign(userInfo, JWT_SECRET, {expiresIn: 60 * 60 * 12}) // token expires in 12 hrs
        res.status(201).json({
            message: "successfully logged in",
            token
        })
    } else if(req.params.reg === "guest") {
        const guestInfo = {
            registered: false
        }
        const token = jwt.sign(guestInfo, JWT_SECRET)
        res.status(201).json({
            message: "guest token",
            token
        })
    } else {
        next()
    }
})

module.exports = api
