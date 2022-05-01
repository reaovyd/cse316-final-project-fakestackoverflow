import React, { useState, useEffect } from 'react';
import "./css/welcomePage.css"
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate
} from "react-router-dom"

const LogoutPage = () => {
    const token = window.localStorage.getItem("token")
    const [display, setDisplay] = useState(<></>)
    const navigate = useNavigate()
    useEffect(() => {
        loginCrud.verifyTokenExist(token).then(res => {
            if(res.data.permission === "user") {
                window.localStorage.removeItem("token")
                window.sessionStorage.removeItem("token")
                setDisplay(<p>Logging out...</p>)
            }
            navigate("/")
        }).catch(err => {
            navigate("/")
        })
    }, [])
    return (
        <div>
            {display}
        </div>
    )
}

export default LogoutPage; 
