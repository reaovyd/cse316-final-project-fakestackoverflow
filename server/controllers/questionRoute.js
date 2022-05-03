const api = require("express").Router()
const jwt = require("jsonwebtoken")
const Question = require("../models/questionSchema")
const Answer = require("../models/answerSchema")
const QComment = require("../models/qCommentSchema")
const AComment = require("../models/aCommentSchema")
const Tag = require("../models/tagSchema")
const User = require("../models/userSchema")
const JWT_SECRET = require("../utils/config").JWT_SECRET
const tokenMiddleware = require("../utils/tokenMiddleware")
const questionMiddleware = require("../utils/questionMiddleware")
api.use(tokenMiddleware.getBearer)
// respective users are allowed to update/delete questiontext

api.get("/",  async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const allQuestions = await Question.find({}).populate("tags").populate("qComments").populate("user") 
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
    // TODO consider user thing; it actually might be a lot easier to put it with tag given my laziness 
    // actually this is optimal since we do it in O(Tags) and len(Tags) = O(users) usually 
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
    var question = await Question.findById(req.params.id)
    if(question === undefined || question === null) {
        const e = new Error("Question may have been deleted or does not exist")
        e.name = "UnknownUserError"
        throw e
    }
    question.views += 1
    var questionDisplay = await Question.findByIdAndUpdate(question._id, question, {new: true}).populate("tags").populate(
        {path:"answers", 
            populate:[
                {
                    path: "user"
                }, 
                {
                    path:"aComments", 
                    populate: {
                        path: "user"
                    } 
                }
            ]
        }
    ).populate("user").populate({path: "qComments", populate: {path: "user"}})
    res.status(200).json(questionDisplay)
})

api.put("/:id/votes/:sentiment", async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET)
    const question = await Question.findById(req.params.id)
    if(question === undefined || question === null) {
        const e = new Error("Question may have been deleted or does not exist")
        e.name = "UnknownQuestionError"
        throw e
    }
    if(payload.registered === false) {
        const e = new Error("Unregistered user cannot vote.")
        e.name = "UnregisteredUserError"
        throw e
    }
    if(req.params.sentiment !== "positive" && req.params.sentiment !== "negative") {
        const e = new Error("Invalid params")
        e.name = "InvalidParamsError"
        throw e
    }

    var userKarma = await User.findById(payload.id)
    if(userKarma.reputation < 100) {
        const e = new Error("User does not have enough reputation")
        e.name = "OutOfBoundsReputationError"
        throw e
    }
    // ill consider that reddit upvote thingy TODO mehhh prob not vote inflation is cool
    // ill consider it at the end as a feature
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
    const question = await Question.findById(req.params.id)
    if(user._id.toString() !== question.user._id.toString()) {
        const e = new Error(`Question does not belong to user ${user.username}`) 
        e.name = "DoesNotBelongQuestionError"
        throw e
    }
    const titleCond = req.body.title === undefined 
        || req.body.title.toEdit === undefined 
        || req.body.title.data === undefined
    const textCond = req.body.text === undefined 
        || req.body.text.toEdit === undefined 
        || req.body.text.data === undefined

    const summaryCond = req.body.summary === undefined 
        || req.body.summary.toEdit === undefined 
        || req.body.summary.data === undefined
    if(textCond || titleCond || summaryCond) {
        const e = new Error("Missing one or more edit conditions")
        e.name = "MissingEditConditions"
        throw e
    }
    if(req.body.title.toEdit === true) {
        question.title = req.body.title.data
    }
    if(req.body.text.toEdit === true) {
        question.text = req.body.text.data
    }
    if(req.body.summary.toEdit === true) {
        question.summary = req.body.summary.data
    }
    await Question.findByIdAndUpdate(question._id, question, {new: true})
    res.status(201).json(question)
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

    const question = await Question.findById(req.params.id)
    if(question === undefined || question === null) {
        const e = new Error("Question may have been deleted or does not exist")
        e.name = "UnknownQuestionError"
        throw e
    }
    if(user._id.toString() !== question.user._id.toString()) {
        const e = new Error(`Question does not belong to user ${user.username}`) 
        e.name = "DoesNotBelongQuestionError"
        throw e
    }
    user.questions = user.questions.filter(userQuestion => userQuestion._id.toString() != question._id.toString())
    await User.findByIdAndUpdate(user._id, user, {new: true})
    var allUsers = await User.find({})
    for (let getUser of allUsers) {
        var newAnswers = []
        const currentUserAnswers = getUser.answers;
        for (let answer of currentUserAnswers) {
            const findAnswer = await Answer.findById(answer)
            if (findAnswer !== null && findAnswer !== undefined && findAnswer.question._id.toString() != question._id.toString()) {
                newAnswers.push(findAnswer)
            }
        }
        var newAComments = []
        const currentAComments = getUser.aComments 
        for (let acomment of currentAComments) {
            const findAComment = await AComment.findById(acomment._id)
            if (findAComment == null || findAComment == undefined) {
                continue
            }
            const findAnswer = await Answer.findById(findAComment.answer._id.toString())
            if (findAnswer == null || findAnswer == undefined) {
                continue
            }
            if (findAnswer.question._id.toString() != question._id.toString()) {
                newAComments.push(acomment)
            } else {
                await AComment.findByIdAndDelete(acomment._id)
            }
        }
        getUser.aComments = newAComments
        getUser.answers = newAnswers
        await User.findByIdAndUpdate(getUser._id.toString(), getUser, {new: true})
    }

    var allUsers = await User.find({})
    for (let getUser of allUsers) {
        var newQComments = []
        const currentQComments = getUser.qComments;
        for (let qcomment of currentQComments) {
            const findQComment = await QComment.findById(qcomment)
            if (findQComment !== null && findQComment !== undefined 
                && findQComment.question._id.toString() != question._id.toString()) {
                newQComments.push(findQComment)
            }
        }
        getUser.qComments = newQComments 
        await User.findByIdAndUpdate(getUser._id.toString(), getUser, {new: true})
    }
    const getAllAnswers = await Answer.find({})
    for (let answer of getAllAnswers) {
        if(answer.question._id.toString() == question._id.toString()) {
            await Answer.findByIdAndDelete(answer._id)
        }
    }
    const getAllQComments = await QComment.find({})

    for(let qcomment of getAllQComments) {
        if(qcomment.question._id.toString() == question._id.toString()) {
            await QComment.findByIdAndDelete(qcomment._id)
        }
    }
    const getAllTags = await Tag.find({})

    for (let tag of getAllTags) {
        var newQuestions = []
        const currentQuestions = tag.questions
        for(let cQuestion of currentQuestions) {
            if(cQuestion._id.toString() != question._id.toString()) {
                newQuestions.push(cQuestion)
            }
        }
        tag.questions = newQuestions
        await Tag.findByIdAndUpdate(tag._id, tag, {new: true})
    }
    await Question.findByIdAndDelete(question._id)

    res.status(200).json({"message": "successfully deleted question"})
})

module.exports = api
