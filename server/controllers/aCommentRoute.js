const AComment = require("../models/aCommentSchema")
const api = require("express").Router()
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../utils/config").JWT_SECRET

api.get("/:id", async (req, res, next) => {

})

module.exports = api
