import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate, useParams, Navigate
} from "react-router-dom"
import NavigationBar from './navigationBar';
import './css/createAnswerPage.css'
import dbCrud from './crud/dbCrud';

const AnswerPageDisplay = ({qid, token}) => {
    const navigate = useNavigate()
    const [inputText, setInputText] = useState('')
    const [errors, setErrors] = useState(<></>)
    const handleInputText = (e) => {
        e.preventDefault();
        setInputText(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const errorList = {
            inputTextEmpty : inputText.length === 0 ? "Answer field cannot be empty!" : false
        }

        const errorDisplay = Object.values(errorList).filter(elem => elem !== false)
        if(errorDisplay.length > 0) {
            setErrors(<div style={{"color" : "red"}}>{errorDisplay[0]}</div>)
            setTimeout(() => {
                setErrors(<></>)
            }, 1600)
        } else {
            dbCrud.postAnswer(token, qid, inputText).then(res => {
                setErrors(<div style={{"color" : "green"}}>{"Successfully Posted!"}</div>)
                setTimeout(() => {
                    setErrors(<></>)
                    navigate(`/home/questions/question/${qid}`)
                }, 800)
            }).catch(err => {
                setErrors(<div style={{"color" : "red"}}>{err.response.data.message}</div>)
                setTimeout(() => {
                    setErrors(<></>)
                }, 1600)
            })
        }
    }
    return (
        <div>
            <NavigationBar />
            <div className="flex-box-container">
                {errors}
                <div className="flex-box-container-item">
                    <form onSubmit={handleSubmit} className="flex-box-container-item-form">
                        <label htmlFor={"answer-text-create"}>
                            <textarea onChange={handleInputText} name="answer-text-create" value={inputText} placeholder={"Write your answer here."}></textarea>
                        </label>
                        <input type="submit" value={"Submit Answer"}/>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function CreateAnswerPage() {
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const { id } = useParams()

    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<AnswerPageDisplay qid={id} token={token}/>)
       }).catch(err => {
           setDisplay(<Navigate replace to={"/login"} />)
       })
    }, [])
    return (
        <div>
            {display}
        </div>
    )
}
