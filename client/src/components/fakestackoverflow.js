import React, { useState, useEffect } from 'react';
import loginCrud from './crud/loginCrud'
import Welcome from "./welcomePage.js"
import Home from "./homePage"
import {
    Routes, Route, Link, useNavigate, Navigate, Redirect
} from "react-router-dom"
import SignUpPage from './signUpPage';
import LoginPage from './loginPage';
import LogoutPage from './logoutPage';
import QuestionsPage from './questionsPage';

const FakeStackOverflow = () => {
    const navigate = useNavigate()
    const [allQuestions, setAllQuestions] = useState([])
    useEffect(() => {
        // depending on if user has valid token
        var token = window.localStorage.token 
        var sessionGuestToken = window.sessionStorage.token
        if (token === undefined && sessionGuestToken === undefined) {
        } else {
            loginCrud.verifyTokenExist(token).then(res => {
                navigate("/home")
            }).catch(err => {
                loginCrud.verifyTokenExist(sessionGuestToken).then(res => {
                    navigate("/welcome")
                }).catch((err) => {
                    navigate("/welcome")
                })
            })
        }

    }, [])
    return (
        <div>
            <Routes>
                <Route path="*" element={<Navigate replace to="/welcome" />}/>
                <Route path="/" element={<Navigate replace to={"/welcome"}/>} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/home" element={<Home />} />
                <Route path="/home/questions" element={<QuestionsPage setAllQuestions={setAllQuestions} questions={allQuestions}/>} />
                <Route path="/signup" element={<SignUpPage />}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/logout" element={<LogoutPage />}/>
            </Routes>
        </div>
    )
}

export default FakeStackOverflow;
