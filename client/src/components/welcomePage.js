import React, { useState, useEffect } from 'react';
import "./css/welcomePage.css"
import loginCrud from './crud/loginCrud';
import SignUpPage from './signUpPage';
import {
    Link, useNavigate
} from "react-router-dom"

const Button = ({text, id, perms, where}) => {
    const navigate = useNavigate()
    const handleDisplay = () => {
        if(perms === "guest") {
            loginCrud.getGuestToken().then(res => {
                const guestToken = res.data.token
                window.sessionStorage.setItem("token", guestToken)
                navigate("/home")
            }).catch(err => {
                navigate("/welcome")
            })
        }
    }
    return (
        <div className="welcome-button">
            <Link className={id} to={`/${where}`} href="#" onClick={handleDisplay}>{text}</Link>
        </div>
    )
}

const MiddleBox = () => {
    var [display, setDisplay] = useState(<></>)
    const initialDisplay = (
            <div className="middle-box-inside">
                <h2><span className="unbold">Fake</span>StackOverflow</h2>
                <Button where={"login"} id={"login-button"} text={"Log In"} setDisplay={setDisplay} perms={"login"}/>
                <Button where={"signup"} id={"sign-up-button"} text={"Sign Up"} setDisplay={setDisplay} perms={"signup"}/>
                <Button where={""} id={"guest-button"} text={"Continue As Guest"} setDisplay={setDisplay} perms={"guest"}/>
        </div>
    )
    useEffect(() => {
        setDisplay(initialDisplay)
    }, [])
    return (
        <div className={"middle-box"}>
            {display}
        </div>
    )
}


export default function Welcome() {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    useEffect(() => {
           loginCrud.verifyTokenExist(token).then(res => {
               navigate("/home")
           }).catch(err => {
               loginCrud.verifyTokenExist(sessionToken).then(res => {
                   navigate("/home")
               }).catch(err => {
                   setDisplay(<MiddleBox />)
               })
           })
    }, [])

    return(
        <div>
            {display} 
        </div>
    )
}
