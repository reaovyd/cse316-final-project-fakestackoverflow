import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import {
    Link, useLocation, useNavigate, useParams
} from "react-router-dom"
import NavigationBar from './navigationBar';

export default function SearchQuestionProxy() {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    const { state } = useLocation()

    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<NavigationBar />)
           navigate("/home/questions/search", {state})
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<NavigationBar />)
               navigate("/home/questions/search", {state})
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
