const getBearer = (req, res, next) => {
    const auth = req.get("authorization")
    if(auth === undefined || !auth.match(/^[Bb]earer /)) {
        const e = new Error("Invalid Bearer")
        e.name = "InvalidBearerToken"
        throw e
    }
    const token = auth.substring(7)
    req.token = token
    next()
}

module.exports = {getBearer}
