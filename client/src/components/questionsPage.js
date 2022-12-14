import React, { useState, useEffect } from 'react';
import loginCrud from './crud/loginCrud';
import dbCrud from './crud/dbCrud';
import NavigationBar from './navigationBar';
import './css/questionsPage.css'
import {
    Link, useNavigate
} from "react-router-dom"
import QuestionsList from './questionsList';

const AllQuestions = ({token}) => {
    const [display, setDisplay] = useState(<></>)
    useEffect(() => {
        dbCrud.fetchQuestions(token).then(res => {
            const currentAllQuestions = res.data
            currentAllQuestions.sort((a, b) => {
			    return Date.parse(a.date) - Date.parse(b.date) > 0 ? -1 : 1
            })
            const currentAllQuestionsLength = currentAllQuestions.length !== 0 ? Math.floor(currentAllQuestions.length / 5 + 1) : 0

            var displayQuestions = [] 
            for(let i = 0; i < currentAllQuestionsLength; ++i) {
                var questionBox = []
                for(let j = i * 5; j < i * 5 + 5 && j < currentAllQuestions.length; ++j) {
                    questionBox.push(currentAllQuestions[j])
                }
                displayQuestions.push(questionBox)
            }
            var displayQuestions = displayQuestions.filter(elem => elem.length !== 0)
            setDisplay(<QuestionsList questions={displayQuestions}/>)
        }).catch(err => {
            console.error(err.response.data)
        })
    }, [])

    return (
        <div>
            <NavigationBar />
            {display}
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
           setDisplay(<AllQuestions token={token}/>)
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<AllQuestions token={sessionToken}/>)
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
