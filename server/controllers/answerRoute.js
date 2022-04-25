const api = require("express").Router()
const jwt = require("jsonwebtoken")
const Answer = require("../models/answerSchema")
const User = require("../models/userSchema")
const Question = require("../models/questionSchema")
const JWT_SECRET = require("../utils/config").JWT_SECRET
const tokenMiddleware = require("../utils/tokenMiddleware")
api.use(tokenMiddleware.getBearer)

// might not need this anyways
api.get("/", async(req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const allAnswers = await Answer.find({}).populate("question").populate("aComments").populate("user")
    res.status(200).json(allAnswers)
})

api.post("/", async(req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET)
    if(payload.registered === false) {
        const e = new Error("Unregistered user")
        e.name = "UnregisteredUserError"
        throw e
    }
    if(req.body.text === undefined) {
        const e = new Error("Text Missing")
        e.name = "MissingTextError"
        throw e
    }

    var question = await Question.findById(req.body.qid)
    var user = await User.findById(payload.id)
    console.log(payload.id)
    if(user === null || question === null) {
        const e = new Error("Question or User Missing")
        e.name = "MissingError"
        throw e
    }

    const newAnswer = new Answer({
        question,
        text: req.body.text,
        user
    })

    var question = await Question.findById(req.body.qid)
    var user = await User.findById(payload.id)
    user.answers = user.answers.concat(newAnswer)
    question.answers = question.answers.concat(newAnswer)

    await User.findByIdAndUpdate(user._id, user, {new:true})
    await Question.findByIdAndUpdate(question._id, question, {new:true})
    // should also contain the qid of the question

    const newAnswerDisplay = await newAnswer.save()
    const display = await Answer.findById(newAnswerDisplay._id) 

    res.status(201).json(display)
})

// TODO need to implement voting

module.exports = api
