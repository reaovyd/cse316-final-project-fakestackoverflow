import React, { useState, useEffect } from 'react';
import "./css/welcomePage.css"
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate
} from "react-router-dom"

const Input = ({placeholder, name, type, text, set}) => {
    const handleText = (e) => {
        e.preventDefault()
        set(e.target.value)
    }
    return (
        <label htmlFor={name} className={"input-margin"}>
            <input htmlFor={name}type={type} placeholder={placeholder} value={text} onChange={handleText}/>
        </label>
    )
}

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(<></>)
    const navigate = useNavigate()
    const token = window.localStorage.getItem("token")
    useEffect(() => {
        loginCrud.verifyTokenExist(token).then(res => {
            if(res.data.permission === "user") {
                navigate("/")
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = {
            emailEmpty : email.length === 0 ? "Email cannot be empty!" : false,
            passwordEmpty: password.length === 0 ? "Password cannot be empty!" : false 
        }
        var errorList = Object.values(errors).filter(elem => elem !== false)

        if (errorList.length > 0) {
            var listErrorList = errorList.map((error, i)=> <li key={i}>{error}</li>)
            setErrors(<ul className={"main-error-list"}>{listErrorList}</ul>)
        } else {
            loginCrud.loginAccount(email, password).then(res => {
                var listCorrect = [<li key={1}>{"Log In Successful!"}</li>, <li key={2}>{"Redirecting to home page"}</li>]
                setErrors(<ul className={"main-correct-list"}>{listCorrect}</ul>)
                const token = res.data.token
                window.localStorage.setItem("token", token)
                window.sessionStorage.removeItem("token")
                setTimeout(() => {
                    navigate("/")
                }, 400)
            }).catch(err => {
                var listErrorList = []
                const data = err.response.data
                if(data === undefined) {
                    listErrorList.push(<li>{"Unexpected Error Occurred"}</li>)
                    setErrors(<ul className={"main-error-list"}>{listErrorList}</ul>)
                } else {
                    listErrorList.push(<li key={1}>{"Invalid Email/Password"}</li>)
                    setErrors(<ul className={"main-error-list"}>{listErrorList}</ul>)
                }
            })
        }
    }
    return (
        <div className={"middle-box"}>
            <div className="signup-user-form">
                <div className="signup-user-form-fso">
                    <h2><span className="unbold">Fake</span>StackOverflow</h2>

                        <div className="signup-margin-headings">
                        <form onSubmit={handleSubmit}>
                            <Input set={setEmail} text={email} type={"text"} placeholder={"Email"} name={"email"}/><br/>
                            <Input set={setPassword} text={password} type={"password"} placeholder={"Password"} name={"password"}/><br/>
                        <input type="submit" value="Login" /> <br/>
                        {errors} 
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
