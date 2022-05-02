import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate, useParams
} from "react-router-dom"
import NavigationBar from './navigationBar';

const SingleQuestionPageDisplay = ({questionId}) => {
    return (
        <div>
        <NavigationBar />
        {questionId}
        </div>
    )
}

export default function SingleQuestionPage() {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    const { id } = useParams()

    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<SingleQuestionPageDisplay questionId={id}/>)
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<SingleQuestionPageDisplay questionId={id}/>)
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
