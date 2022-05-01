const verifyUser = (req, res, next) => {
    if(req.params.reg === "guest") {
        next()
    } else {
        if(req.body.username === undefined || req.body.username.length === 0) {
            const e = new Error("Missing username")
            e.name = "MissingUsernameError"
            throw e
        }
        next()
    }
}

const verifyEmail = (req, res, next) => {
    if(req.params.reg === "guest") {
        next()
    } else {
        if(req.body.email === undefined) {
            const e = new Error("Missing email")
            e.name = "MissingEmailError"
            throw e
        }
        const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ // credit to https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression

        if(!req.body.email.match(regex)) {
            const e = new Error("Email format is invalid!")
            e.name = "InvalidEmailFormatError"
            throw e
        }
        next()
    }
}

const verifyPasswordExist = (req, res, next) => {
    if(req.params.reg === "guest") {
        next()
    } else {
        if(req.body.password === undefined) {
            const e = new Error("Missing password")
            e.name = "MissingPasswordError"
            throw e
        }
        next()
    }
}

module.exports = { verifyUser, verifyEmail, verifyPasswordExist }
