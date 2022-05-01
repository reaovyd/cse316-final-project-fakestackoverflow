import React, { useState, useEffect } from 'react';
import loginCrud from './crud/loginCrud';
import dbCrud from './crud/dbCrud';
import NavigationBar from './navigationBar';
import {
    Link, useNavigate
} from "react-router-dom"

const AllQuestions = () => {
    const [allQuestions, setAllQuestions] = useState('')
    useEffect(() => {
    })
    return (
        <div>
            <NavigationBar />
        </div>
    )
}

export default function QuestionsPage() {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<AllQuestions />)
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<AllQuestions />)
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
