import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate, useParams
} from "react-router-dom"
import './css/questionsPage.css' 

const QuestionBox = ({question}) => {
    const questionTitle = (<Link className={"link-stuff"} to={`/home/questions/question/${question._id}`}>{question.title}</Link>)
    const questionSummary = question.summary
    const questionTags = question.tags.map((tag, i) => <div key={i} className="tag-item">{tag.name}</div>)
    const today = new Date(Date.parse(question.date))

    const askedOn = [today.toLocaleString("default", {month: "long"}).slice(0, 3),
        String(today.getDate()).padStart(2, "0")+",", String(today.getFullYear())].join(" ")
    const askedAt = [String(today.getHours()).padStart(2, "0"), String(today.getMinutes()).padStart(2, "0")].join(":")
    const questionTime = askedOn + " " + askedAt;

    return (
        <div className="question-box">
            <div className="small-items">
               <div className="item">
                    {question.votes} votes 
                </div>
               <div className="item">
                    {question.answers.length} answers
                </div>
               <div className="item">
                    {question.views} views
                </div>
                <div className="item">
                   <div className="special-name">
                        <span className="posted-by-special">Posted by</span> {question.user.username} 
                    </div>
                    at <span className="nice-light-blue">{questionTime}</span>
                </div>
            </div>
            <div className="larger-items">
                <div className="larger-item">
                    {questionTitle}
                </div>
                <div className="larger-item summary">
                    {questionSummary}
                </div>
            </div>
            <div className="tag-items">
        <div className="tag-item special-tag">Tags:</div>
                {questionTags}
            </div>
        </div>
    )
}

const Button = ({style, clickFunction, name}) => {
    return (
        <button onClick={clickFunction}className={style ? "btn-navigation-stop" : "btn-navigation" }>{name}</button>
    )
}

export default function QuestionsList({questions}) {
    const [display, setDisplay] = useState(<></>)
    const [page, setPage] = useState(0)
    const [prevStyle, setPrevStyle] = useState(false)
    const [nextStyle, setNextStyle] = useState(false)
    useEffect(() => {
        if(questions.length === 0) { // set to no results found or smth
            setDisplay(<>No Questions Found.</>)
        } else {
            setDisplay(questions[page].map((question, i) => <QuestionBox key={i} question={question} />))
            if(page === 0) {
                setPrevStyle(true)
            }
            if(page === questions.length - 1) {
                setNextStyle(true)
            }
        }
    }, [])
    const handleNextClick = () =>{
        if(page + 1 < questions.length) {
            setDisplay(questions[page + 1].map((question, i) => <QuestionBox key={i} question={question} />))
            setPrevStyle(false)
            if(page + 2 >= questions.length) {
                setNextStyle(true)
            }
            setPage(page + 1)
        }
    }

    const handlePrevClick = () =>{
        if(page - 1 >= 0) {
            setDisplay(questions[page - 1].map((question, i) => <QuestionBox key={i} question={question} />))
            setNextStyle(false)
            if(page - 1 <= 0) {
                setPrevStyle(true)
            }
            setPage(page - 1)
        }
    }
    
    return (
        <div>
            <div className="flex-container">
                {display}
        {questions.length !== 0 ? <div className="flex-sub-container">
                    <div className="btn-item">
                        <Button style={prevStyle}clickFunction={handlePrevClick} className={"btn-navigation"} name={"Prev"}/>
                    </div>
                    <div className="btn-item">
                        <Button style={nextStyle}clickFunction={handleNextClick} className={"btn-navigation"} name={"Next"}/>
                    </div>
                </div>: <></>}
            </div> 
        </div>
    )
}
