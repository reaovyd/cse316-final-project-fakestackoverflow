const api = require("express").Router()
const jwt = require("jsonwebtoken")
const Answer = require("../models/answerSchema")
const AComment = require("../models/aCommentSchema")
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

api.get("/:id", async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const answer = await Answer.findById(req.params.id)

    if(answer === undefined || answer === null) {
        const e = new Error("Answer may have been deleted or does not exist")
        e.name = "UnknownUserError"
        throw e
    }
    res.status(200).json(answer)
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

api.post("/:id/votes/:sentiment", async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET)
    const answer = await Answer.findById(req.params.id)
    if(answer === undefined || answer === null) {
        const e = new Error("Answer may have been deleted or does not exist")
        e.name = "UnknownAnswerError"
        throw e
    }
    if(payload.registered === false) {
        const e = new Error("Unregistered user")
        e.name = "UnregisteredUserError"
        throw e
    }
    if(req.params.sentiment !== "positive" && req.params.sentiment !== "negative") {
        const e = new Error("Invalid params")
        e.name = "InvalidParamsError"
        throw e
    }

    var userKarma = await User.findById(answer.user)
    if(userKarma.reputation < 100) {
        const e = new Error("User does not have enough reputation")
        e.name = "OutOfBoundsReputationError"
        throw e
    }

    if(req.params.sentiment === "positive") {
        answer.votes += 1
        const user = await User.findById(answer.user)
        user.reputation += 5
        await User.findByIdAndUpdate(user._id, user, { new: true} )
    } else if(req.params.sentiment === "negative") {
        answer.votes -= 1
        const user = await User.findById(answer.user)
        user.reputation -= 10
        await User.findByIdAndUpdate(user._id, user, { new: true} )
    }
    await Answer.findByIdAndUpdate(answer._id, answer, {new: true})
    res.status(201).json(answer)

})

api.put("/:id", async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET)
    if(payload.registered === false) {
        const e = new Error("Unregistered user")
        e.name = "UnregisteredUserError"
        throw e
    }
    const user = await User.findById(payload.id)
    if(user === undefined || user === null) {
        const e = new Error("User may have been deleted or does not exist")
        e.name = "UnknownUserError"
        throw e
    }
    const answer = await Answer.findById(req.params.id)
    if(user._id.toString() !== answer.user._id.toString()) {
        const e = new Error(`Answer does not belong to user ${user.username}`) 
        e.name = "DoesNotBelongAnswerError"
        throw e
    }
    const textCond = req.body.text === undefined 
        || req.body.text.toEdit === undefined 
        || req.body.text.data === undefined
    if(textCond) {
        const e = new Error("Missing one or more edit conditions")
        e.name = "MissingEditConditions"
        throw e
    }
    if(req.body.text.toEdit === true) {
        answer.text = req.body.text.data
    }
    await Answer.findByIdAndUpdate(answer._id, answer, {new: true})
    res.status(201).json(answer)
})

api.delete("/:id", async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET)
    if(payload.registered === false) {
        const e = new Error("Unregistered user")
        e.name = "UnregisteredUserError"
        throw e
    }

    const user = await User.findById(payload.id)
    if(user === undefined || user === null) {
        const e = new Error("User may have been deleted or does not exist")
        e.name = "UnknownUserError"
        throw e
    }

    const answer = await Answer.findById(req.params.id)
    if(answer === undefined || answer === null) {
        const e = new Error("Answer may have been deleted or does not exist")
        e.name = "UnknownAnswerError"
        throw e
    }
    // remove answer from user
    const getUser = await User.findById(answer.user)
    getUser.answers = getUser.answers.filter(ans => ans._id.toString() != answer._id.toString())
    await User.findByIdAndUpdate(getUser._id, getUser, {new: true})
    
    // remove any acomments related to answer to user
    const getAllUsers = await User.find({})
    for (let currentUser of getAllUsers) {
        var newAComments = []
        const currentAComments = currentUser.aComments
        for (let currentAComment of currentAComments) {
            const findAComment = await AComment.findById(currentAComment._id)
            if(findAComment.answer._id.toString() != answer._id.toString()) {
                newAComments.push(currentAComment)
            }
        }
        currentUser.aComments = newAComments 
        await User.findByIdAndUpdate(currentUser._id, currentUser, {new:true})
    }

    const getQuestion = await Question.findById(answer.question)
    getQuestion.answers = getQuestion.answers.filter(ans => ans._id.toString() != answer._id.toString())
    await Question.findByIdAndUpdate(getQuestion._id, getQuestion, {new: true})

    const getAComments = answer.aComments  
    for (let currentAComment of getAComments) {
        await AComment.findByIdAndDelete(currentAComment._id)
    }
    await Answer.findByIdAndDelete(answer._id)

    res.status(200).json({"message": "successfully deleted answer"})
})


module.exports = api
