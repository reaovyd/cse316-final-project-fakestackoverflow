import React, { useState, useEffect } from 'react';
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate
} from "react-router-dom"

export default function QuestionsPage({allQuestions, setAllQuestions}) {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<>b</>)
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<>b</>)
           }).catch(err => {
               navigate("/welcome")
           })
       })
    }, [])
    return (
        <div>
            {display}
        </div>
    )
}
