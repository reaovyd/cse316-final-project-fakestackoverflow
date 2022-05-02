import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate, useParams, Navigate
} from "react-router-dom"
import NavigationBar from './navigationBar';
import './css/create.css'
import dbCrud from './crud/dbCrud';

const Input = ({placeholder, name, type, text, set}) => {
    const handleText = (e) => {
        e.preventDefault()
        set(e.target.value)
    }
    return (
        <label htmlFor={name} className={"create-input-margin"}>
            <textarea htmlFor={name}type={type} placeholder={placeholder} value={text} onChange={handleText}>
        </textarea>
        </label>
    )
}

const CreateQuestion = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [tags, setTags] = useState('')
    const [summary, setSummary] = useState('')
    const [errors, setErrors] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = {
            titleEmpty: title.length === 0 ? "Title cannot be empty!" : false,
            textEmpty: text.length === 0 ? "Text cannot be empty!" : false,
            summaryEmpty: summary.length === 0 ? "Summary cannot be empty!" : false,
            tagsEmpty: tags.length === 0 ? "Tags cannot be empty!" : false,
            titleMax: title.length > 50 ? "Title cannot be more than 50 characters!" : false,
            summaryMax: summary.length > 140 ? "Summary cannot be more than 140 characters!" : false,
        }
        var errorList = Object.values(errors).filter(elem => elem !== false)
        if (errorList.length > 0) {
            var listErrorList = errorList.map((error, i)=> <li key={i}>{error}</li>)
            setErrors(<ul className={"create-main-error-list"}>{listErrorList}</ul>)
        } else {
            const sendTags = tags.split(/\s+/)
            const token = window.localStorage.getItem("token")
            dbCrud.postQuestion(token, title, text, summary, sendTags).then(res => {
                var listCorrect = [<li key={1}>{"Question successfully posted!"}</li>, <li key={2}>{"Redirecting back to home page"}</li>]
                setErrors(<ul className={"create-main-correct-list"}>{listCorrect}</ul>)
                setTimeout(() => {
                    navigate("/home/questions")
                }, 400)
            }).catch(err => {
                var listErrorList = [<li key={1}>{err.response.data.message}</li>]
                setErrors(<ul className={"create-main-error-list"}>{listErrorList}</ul>)
            })
        }
    }

    return (
        <div>
            <NavigationBar/>

            <div className={"middle-box-create"}>
                <div className={"middle-box-create-inside"}>
                    <form onSubmit={handleSubmit}>
                        <h4>Title</h4>
                        <Input placeholder={""} name={"title"} type={"text"} text={title} set={setTitle}/>
                        <h4>Text</h4>
                        <Input placeholder={""} name={"text"} type={"text"} text={text} set={setText}/>
                        <h4>Summary</h4>
                        <Input placeholder={""} name={"summary"} type={"text"} text={summary} set={setSummary}/>
                        <h4>Tags</h4>
                        <Input placeholder={""} name={"tags"} type={"text"} text={tags} set={setTags}/>
                       <input type="submit" value="Submit Question" /> <br/>
                        {errors}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function CreateQuestionPage() {
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")

    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<CreateQuestion />)
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
