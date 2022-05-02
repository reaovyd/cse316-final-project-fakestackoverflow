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
import SingleQuestionPage from './singleQuestionPage';
import CreateQuestionPage from './createQuestionPage';
import SingleUserPage from './singleUserPage';
import SearchQuestionsPage from './searchQuestionPage';
import SearchQuestionProxy from './searchQuestionProxy';
import TagsPage from './tagsPage';
import SingleTagsPage from './singleTagPage';

const FakeStackOverflow = () => {
    //const navigate = useNavigate()
    //const [allQuestions, setAllQuestions] = useState([])
    //useEffect(() => {
    //    // depending on if user has valid token
    //    var token = window.localStorage.token 
    //    var sessionGuestToken = window.sessionStorage.token
    //    if (token === undefined && sessionGuestToken === undefined) {
    //    } else {
    //        loginCrud.verifyTokenExist(token).then(res => {
    //        }).catch(err => {
    //            loginCrud.verifyTokenExist(sessionGuestToken).then(res => {
    //            }).catch((err) => {
    //            })
    //        })
    //    }
    //}, [])

    return (
        <div>
            <Routes>
                <Route path="*" element={<Navigate replace to={"/welcome"}/>} />
                <Route path="/" element={<Navigate replace to={"/welcome"}/>} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/home" element={<Home />} />
                <Route path="/home/questions" element={<QuestionsPage />}/>
                <Route path="/home/tags" element={<TagsPage />}/>
                <Route path="/home/questions/question/:id" element={<SingleQuestionPage />} />
                <Route path="/home/questions/tags/:tid" element={<SingleTagsPage />} />
                <Route path="/home/questions/search" element={<SearchQuestionsPage />} />
                <Route path="/home/questions/searchproxy" element={<SearchQuestionProxy />}/>
                <Route path="/home/questions/create" element={<CreateQuestionPage />} />
                <Route path="/home/users/user/:id" element={<SingleUserPage />} />
                <Route path="/signup" element={<SignUpPage />}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/logout" element={<LogoutPage />}/>
            </Routes>
        </div>
    )
}

export default FakeStackOverflow;
