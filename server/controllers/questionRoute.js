const api = require("express").Router()
const jwt = require("jsonwebtoken")
const Question = require("../models/questionSchema")
const Tag = require("../models/tagSchema")
const User = require("../models/userSchema")
const JWT_SECRET = require("../utils/config").JWT_SECRET
const tokenMiddleware = require("../utils/tokenMiddleware")
const questionMiddleware = require("../utils/questionMiddleware")
api.use(tokenMiddleware.getBearer)
// respective users are allowed to update/delete questiontext

api.get("/",  async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const allQuestions = await Question.find({}).populate("tags").populate("qComments") 
    res.status(200).json(allQuestions)
})

api.post("/",  questionMiddleware.validBody, async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET)
    if(payload.registered === false) { 
        const e = new Error("Unregistered user")
        e.name = "UnregisteredUserError"
        throw e
    }

    const id = payload.id
    var user = await User.findById(id)
    if(user === undefined || user === null) {
        const e = new Error("User may have been deleted or does not exist")
        e.name = "UnknownUserError"
        throw e
    }

    const getAllTags = await Tag.find({})
    const tagNames = getAllTags.map(elem => elem.name)
    // user wants to put new tag name but needs at least 100 reddit karma 
    const karma = user.reputation // lmao
    const newTags = req.body.tags.filter(name => !tagNames.includes(name)) 
    if(newTags.length > 0 && karma < 100) {
        const e = new Error("User does not have enough reputation")
        e.name = "OutOfBoundsReputationError"
        throw e
    }

    const newQuestion = new Question({
        user,
        title: req.body.title,
        text: req.body.text,
        summary: req.body.summary
    })
    
    for(let name of newTags) {
        const newTag = new Tag({
            name
        })
        await newTag.save()
    }
    for(let name of req.body.tags) {
        const tag = await Tag.findOne({name: name})
        tag.questions = tag.questions.concat(newQuestion)
        await Tag.findByIdAndUpdate(tag._id, tag, {new: true})
        newQuestion.tags = newQuestion.tags.concat(tag._id)
        await Question.findByIdAndUpdate(newQuestion._id, newQuestion, {new: true})
    }
    var user = await User.findById(user._id)
    user.questions = user.questions.concat(newQuestion)
    await User.findByIdAndUpdate(user._id, user, {new: true})
    const newQ = await newQuestion.save()
    const newQDisplay = await Question.findById(newQ._id)

    res.status(201).json(newQDisplay)
})

api.get("/:id", async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const question = await Question.findById(req.params.id)
    if(question === undefined || question === null) {
        const e = new Error("Question may have been deleted or does not exist")
        e.name = "UnknownUserError"
        throw e
    }
    res.status(200).json(question)
})

api.put("/:id/views", async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const question = await Question.findById(req.params.id)
    if(question === undefined || question === null) {
        const e = new Error("User may have been deleted or does not exist")
        e.name = "UnknownUserError"
        throw e
    }
    question.views += 1
    await Question.findByIdAndUpdate(question._id, question, {new: true})
    res.status(201).json(question)
})

api.put("/:id/votes/:sentiment", async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET)
    const question = await Question.findById(req.params.id)
    if(question === undefined || question === null) {
        const e = new Error("User may have been deleted or does not exist")
        e.name = "UnknownUserError"
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

    var userKarma = await User.findById(question.user)
    if(userKarma.reputation < 100) {
        const e = new Error("User does not have enough reputation")
        e.name = "OutOfBoundsReputationError"
        throw e
    }
    // ill consider that reddit upvote thingy TODO
    if(req.params.sentiment === "positive") {
        question.votes += 1
        const user = await User.findById(question.user)
        user.reputation += 5
        await User.findByIdAndUpdate(user._id, user, { new: true} )
    } else if(req.params.sentiment === "negative") {
        question.votes -= 1
        const user = await User.findById(question.user)
        user.reputation -= 10
        await User.findByIdAndUpdate(user._id, user, { new: true} )
    }
    await Question.findByIdAndUpdate(question._id, question, {new: true})
    res.status(201).json(question)
})

module.exports = api
