import React, { useState, useEffect } from 'react';
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate
} from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           navigate("/home/questions")
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               navigate("/home/questions")
           }).catch(err => {
               navigate("/welcome")
           })
       })
    }, [])
    return (
        <div>
        </div>
    )
}
