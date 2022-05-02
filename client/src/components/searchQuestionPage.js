import React, { useState, useEffect } from 'react';
import loginCrud from './crud/loginCrud';
import dbCrud from './crud/dbCrud';
import NavigationBar from './navigationBar';
import './css/questionsPage.css'
import {
    Link, useLocation, useNavigate, useSearchParams,
} from "react-router-dom"
import QuestionsList from './questionsList';

const AllQuestions = ({token, param}) => {
    const [display, setDisplay] = useState(<></>)
    useEffect(() => {
        dbCrud.fetchQuestions(token).then(res => {
            let currentAllQuestions = res.data
            if(param.length !== 0) {
                var searchStuff = [...new Set(param.toLowerCase().split(/\s+/).filter(elem => elem.length !== 0))]
                var removeTags = searchStuff.filter(elem => {
                    return elem.match(/^\[\w+\]$/)
                })
                var tagNames = removeTags.map(name => name.slice(1, name.length - 1))
                var getTextOnly = searchStuff.filter(name => !removeTags.includes(name)) 
                currentAllQuestions = currentAllQuestions.filter(elem => {
                    const getTagNames = elem.tags.map(tag => tag.name)
                    for (let name of tagNames) {
                        if(getTagNames.includes(name)) {
                            return true;
                        }
                    }
                    for (let text of getTextOnly) {
                        if(elem.summary.toLowerCase().indexOf(text) !== -1 || elem.text.toLowerCase().indexOf(text) !== -1 || elem.title.toLowerCase().indexOf(text) !== -1) {
                            return true;
                        }
                    }
                    return false;
                })
                // title summary or question text
            }
            currentAllQuestions.sort((a, b) => {
			    return Date.parse(new Date(a.ansOn + " " + a.ansAt)) - Date.parse(new Date(b.ansOn + " " + b.ansAt)) > 0 ? -1 : 1
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

export default function SearchQuestionsPage() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    const sendSearch = state ? state.text : "";
    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<AllQuestions param={sendSearch} token={token}/>)
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<AllQuestions param={sendSearch} token={sessionToken}/>)
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
