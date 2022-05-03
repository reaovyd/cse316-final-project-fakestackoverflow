const QComment = require("../models/qCommentSchema")
const User = require("../models/userSchema")
const api = require("express").Router()
const jwt = require("jsonwebtoken")
const Question = require("../models/questionSchema")
const JWT_SECRET = require("../utils/config").JWT_SECRET
const tokenMiddleware = require("../utils/tokenMiddleware")
api.use(tokenMiddleware.getBearer)

api.get("/:id", async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)  
    const comment = await QComment.findById(req.params.id)
    if(comment === undefined || comment === null) {
        const e = new Error("Comment may have been deleted or does not exist")
        e.name = "UnknownCommentError"
        throw e
    }
    res.status(200).json(comment)
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
    var question = await Question.findById(req.body.qid)
    var user = await User.findById(payload.id)
    if(user === null || question === null) {
        const e = new Error("Question or User Missing")
        e.name = "MissingError"
        throw e
    }
    if(user.reputation < 100) {
        const e = new Error("User does not have enough reputation")
        e.name = "OutOfBoundsReputationError"
        throw e
    }
    const newQComment = new QComment({
        question,
        comment: req.body.comment,
        user
    })

    var question = await Question.findById(req.body.qid)
    var user = await User.findById(payload.id)
    user.qComments = user.qComments.concat(newQComment)
    question.qComments = question.qComments.concat(newQComment)

    await User.findByIdAndUpdate(user._id, user, {new:true})
    await Question.findByIdAndUpdate(question._id, question, {new:true})
    // should also contain the qid of the question

    const newComment = await newQComment.save()
    const display = await QComment.findById(newComment._id).populate("user")

    res.status(201).json(display)
})

module.exports = api
