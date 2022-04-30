const AComment = require("../models/aCommentSchema")
const Answer = require("../models/answerSchema")
const User = require("../models/userSchema")
const api = require("express").Router()
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../utils/config").JWT_SECRET
const tokenMiddleware = require("../utils/tokenMiddleware")
api.use(tokenMiddleware.getBearer)

api.get("/:id", async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const aComment = await AComment.findById(req.params.id)
    if(aComment === undefined || aComment === null) {
        const e = new Error("Comment may have been deleted or does not exist")
        e.name = "UnknownCommentError"
        throw e
    }
    res.status(200).json(aComment)
})

api.post("/", async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET)
    if(payload.registered === false) {
        const e = new Error("Unregistered user")
        e.name = "UnregisteredUserError"
        throw e
    }
    if(req.body.comment === undefined) {
        const e = new Error("Comment Missing")
        e.name = "MissingCommentError"
        throw e
    }
    var answer = await Answer.findById(req.body.aid)
    var user = await User.findById(payload.id)
    if(user === null || answer === null) {
        const e = new Error("Answer or User Missing")
        e.name = "MissingError"
        throw e
    }

    if(user.reputation < 100) {
        const e = new Error("User does not have enough reputation")
        e.name = "OutOfBoundsReputationError"
        throw e
    }

    const newAComment = new AComment({
        answer,
        comment: req.body.comment,
        user
    })

    var answer = await Answer.findById(req.body.aid)
    var user = await User.findById(payload.id)
    user.aComments = user.aComments.concat(newAComment)
    answer.aComments = answer.aComments.concat(newAComment)

    await User.findByIdAndUpdate(user._id, user, {new:true})
    await Answer.findByIdAndUpdate(answer._id, answer, {new:true})
    // should also contain the qid of the question

    const newComment = await newAComment.save()
    const display = await AComment.findById(newComment._id) 

    res.status(201).json(display)
})

module.exports = api
