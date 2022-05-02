import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import tagsCrud from './crud/tagsCrud'; 
import {
    Link, useNavigate, useParams
} from "react-router-dom"
import NavigationBar from './navigationBar';
import QuestionsList from './questionsList';

const SingleTagPageDisplay = ({token, tagId}) => {
    const [display, setDisplay] = useState(<div style={{"textAlign": "center"}}>No Questions Found</div>)
    useEffect(() => {
        tagsCrud.fetchSingleTag(token, tagId).then(res => {
            if(res.data.questions.length > 0) {
                const currentAllQuestions = res.data.questions
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
            }
        }).catch(err => {
        })
    })
    return (
        <div>
        <NavigationBar />
        {display}
        </div>
    )
}

export default function SingleTagsPage() {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    const { tid } = useParams()

    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<SingleTagPageDisplay token={token} tagId={tid}/>)
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<SingleTagPageDisplay token={sessionToken} tagId={tid}/>)
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
