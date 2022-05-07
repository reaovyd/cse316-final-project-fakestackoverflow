import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import dbCrud from './crud/dbCrud';
import userCrud from './crud/userCrud';
import {
    Link, useNavigate, useParams
} from "react-router-dom"
import NavigationBar from './navigationBar';
import "./css/singleUserPage.css"
/*
        <div>
            <form onSubmit={handleSubmit} className="form-question-update">
                <div className="form-ans-update-item text-input">
                    <label htmlFor="edit-ans">
                        <textarea onChange={handleInput}value={input} name="edit-ans"></textarea>
                    </label>
                </div>
                <div className="form-ans-update-item button-input">
                    <input type="submit" value={"Update Answer"}/>
                </div>
                {errors}
            </form>
        </div>
 *
 */

const NewQuestionForm = ({setQuestionsToDisplay, isTheUser, setData, userData, handleDelete, handleEdit, setEditDisplay, qid}) => {
    const [inputTitle, setInputTitle] = useState('')
    const [inputText, setInputText] = useState('')
    const [inputSummary, setInputSummary] = useState('')
    const [errors, setErrors] = useState(<></>)
    const handleInputTitle = (e) => {
        e.preventDefault()
        setInputTitle(e.target.value)
    }
    const handleInputText = (e) => {
        e.preventDefault()
        setInputText(e.target.value)
    }
    const handleInputSummary = (e) => {
        e.preventDefault()
        setInputSummary(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        const errorsObject = {
            titleLengthError : inputTitle.length === 0 ? "Title cannot be empty!" : false,
            textLengthError : inputText.length === 0 ? "Text cannot be empty!" : false,
            summaryLengthError : inputSummary.length === 0 ? "Summary cannot be empty!" : false,
            titleMaxLengthError : inputTitle.length > 50 ? "Title cannot be more than 50 characters!" : false,
            summaryMaxLengthError : inputSummary.length > 140? "Summary cannot be more than 140 characters!" : false,
        }
        const errorsDisplay = Object.values(errorsObject).filter(elem => elem !== false).map((elem, i) => <li key={i}>{elem}</li>)
        if(errorsDisplay.length > 0) {
            setErrors(
                <ul className={"form-ans-unordered-list-error"}>
                    {errorsDisplay}
                </ul>
            )
            setTimeout(() => {
                setErrors(<></>)
            }, 1600)
        } else {
            const token = window.localStorage.getItem("token")
            dbCrud.updateQuestionAll(token, qid, inputTitle, inputText, inputSummary).then(res => {
                userCrud.fetchUser(token, userData._id).then(res => {
                    const newData = res.data
                    setData(newData)
                    const newQuestions = newData.questions
                    setQuestionsToDisplay(newData.questions.length === 0 ? <>No Questions Found</> : divideAnArray(newQuestions, 5).
                        map((questionSet, i) => {
                            const questionDisplayReturn = questionSet.map((question, j) => {
                                const tagsDisplay = question.tags.map(tag => tag.name).reduce((acc, item) => {
                                    return acc + " " + item
                                }, "")
                                return (
                                    <div key={j} className="main-questions-display-box-user-page">
                                        <div className="main-questions-display-box-user-page-item">
                                            <div className="sub-question-display-box-item top-part">
                                                <div className="sub-question-display-box-item title-part">
                                                    <Link to={`/home/questions/question/${question._id}`}>{question.title}</Link> 
                                                </div>
                                                <div className="sub-question-display-box-item user-part">
                                                    <div className="sub-question-display-box-user-part-item">
                                                    Asked By <span style={{"color":"blue"}}>{question.user.username}
                                                            </span>
                                                    </div>
                                                    <div className="sub-question-display-box-user-part-item">
                                                    At <span style={{"color":"green"}}>{parseDate(question.date)}
                                                            </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="sub-question-display-box-item middle-summary-part">
                                                {question.summary}
                                            </div>
                                            <div className="sub-question-display-box-item tags-part">
                                                Tags: {tagsDisplay} 
                                            </div>
                                        </div>

                                        <div className="main-questions-display-box-user-page-item">
                                            {isTheUser ? <div><Link onClick={() => handleEdit(question._id)}to="#">Edit</Link> <Link onClick={() => handleDelete(question._id)}to="#">Delete</Link></div>: <></>}
                                        </div>
                                    </div>
                                )
                            })
                            return (
                                <div key={i}>
                                    {questionDisplayReturn}
                                </div>
                            )
                        })
                    )
                    var successDisplay = [<li key={1}>{"Successfully updated"}</li>]
                    setErrors(
                        <ul className={"form-ans-unordered-list-success"}>
                            {successDisplay}
                        </ul>
                    )
                    setTimeout(() => {
                        setEditDisplay({
                            show: false,
                            display: <></>
                        })
                    }, 1600)

                    

                }).catch(err => {
                    var errorDisplay = [<li key={1}>{"Did not update question"}</li>]
                    setErrors(
                        <ul className={"form-ans-unordered-list-error"}>
                            {errorDisplay}
                        </ul>
                    )
                })

            }).catch(err => {
                var errorDisplay = [<li key={1}>{"Did not update question"}</li>]
                setErrors(
                    <ul className={"form-ans-unordered-list-error"}>
                        {errorDisplay}
                    </ul>
                )
            })
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}className="form-question-update">
                <div className="form-question-update-item title-input">
                    <label htmlFor="edit-title-question">
                        <textarea placeholder={"New Title Here"}onChange={handleInputTitle}value={inputTitle} name="edit-title-question"></textarea>
                    </label>
                </div>
                <div className="form-question-update-item text-input">
                    <label htmlFor="edit-text-question">
                        <textarea placeholder={"New Text Here"}onChange={handleInputText}value={inputText} name="edit-text-question"></textarea>
                    </label>
                </div>
                <div className="form-question-update-item summary-input">
                    <label htmlFor="edit-summary-question">
                        <textarea placeholder={"New Summary Here"}onChange={handleInputSummary}value={inputSummary} name="edit-summary-question"></textarea>
                    </label>
                </div>
                <div className="form-ans-update-item button-input">
                    <input type="submit" value={"Update Question"}/>
                </div>
                {errors}
            </form>
        </div>
    )
}

const QuestionsDisplay = ({userData, isTheUser, setData}) => {
    const [questionsToDisplay, setQuestionsToDisplay] = useState(<></>)
    const [editDisplay, setEditDisplay] = useState({
        show: false,
        display: <></>
    })
    const [page, setPage] = useState(0)

    const handleNextClick = () =>{
        if(page + 1 < questionsToDisplay.length) {
            setPage(page + 1)
        }
    }

    const handlePrevClick = () =>{
        if(page - 1 >= 0) {
            setPage(page - 1)
        }
    }
    const handleEdit = (qid) => {
        setEditDisplay({show: true, 
            display: (
                <NewQuestionForm setQuestionsToDisplay={setQuestionsToDisplay} isTheUser={isTheUser} setData={setData}userData={userData}handleDelete={handleDelete} handleEdit={handleEdit} setEditDisplay={setEditDisplay}qid={qid}/>
            )})
    }

    const handleDelete = (qid) => {
        if(window.confirm("Are you sure you want to delete this question?")) {
            const token = window.localStorage.getItem("token")
            dbCrud.deleteQuestion(token, qid).then(res => {
                userCrud.fetchUser(token, userData._id).then(resData => {
                    const newData = resData.data
                    setQuestionsToDisplay(newData.questions.length === 0 ? <>No Questions Found</> : divideAnArray(newData.questions, 5).
                        map((questionSet, i) => {
                            const questionDisplayReturn = questionSet.map((question, j) => {
                                const tagsDisplay = question.tags.map(tag => tag.name).reduce((acc, item) => {
                                    return acc + " " + item
                                }, "")
                                return (
                                    <div key={j} className="main-questions-display-box-user-page">
                                        <div className="main-questions-display-box-user-page-item">
                                            <div className="sub-question-display-box-item top-part">
                                                <div className="sub-question-display-box-item title-part">
                                                    <Link to={`/home/questions/question/${question._id}`}>{question.title}</Link> 
                                                </div>
                                                <div className="sub-question-display-box-item user-part">
                                                    <div className="sub-question-display-box-user-part-item">
                                                    Asked By <span style={{"color":"blue"}}>{question.user.username}
                                                            </span>
                                                    </div>
                                                    <div className="sub-question-display-box-user-part-item">
                                                    At <span style={{"color":"green"}}>{parseDate(question.date)}
                                                            </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="sub-question-display-box-item middle-summary-part">
                                                {question.summary}
                                            </div>
                                            <div className="sub-question-display-box-item tags-part">
                                                Tags: {tagsDisplay} 
                                            </div>
                                        </div>

                                        <div className="main-questions-display-box-user-page-item">
                                            {isTheUser ? <div><Link onClick={() => handleEdit(question._id)}to="#">Edit</Link> <Link onClick={() => handleDelete(question._id)}to="#">Delete</Link></div>: <></>}
                                        </div>
                                    </div>
                                )
                            })
                            return (
                                <div key={i}>
                                    {questionDisplayReturn}
                                </div>
                            )
                        })
                    )
                    setData(newData)
                }).catch(err => {
                    window.alert("Unexpected error occurred")
                })
            }).catch(err => {
                window.alert("Error: failed to delete!")
            })
        }
    }
    useEffect(() => {
        setQuestionsToDisplay(userData.questions.length === 0 ? <>No Questions Found</> : divideAnArray(userData.questions, 5).
            map((questionSet, i) => {
                const questionDisplayReturn = questionSet.map((question, j) => {
                    const tagsDisplay = question.tags.map(tag => tag.name).reduce((acc, item) => {
                        return acc + " " + item
                    }, "")
                    return (
                        <div key={j} className="main-questions-display-box-user-page">
                            <div className="main-questions-display-box-user-page-item">
                                <div className="sub-question-display-box-item top-part">
                                    <div className="sub-question-display-box-item title-part">
                                        <Link to={`/home/questions/question/${question._id}`}>{question.title}</Link> 
                                    </div>
                                    <div className="sub-question-display-box-item user-part">
                                        <div className="sub-question-display-box-user-part-item">
                                        Asked By <span style={{"color":"blue"}}>{question.user.username}
                                                </span>
                                        </div>
                                        <div className="sub-question-display-box-user-part-item">
                                        At <span style={{"color":"green"}}>{parseDate(question.date)}
                                                </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="sub-question-display-box-item middle-summary-part">
                                    {question.summary}
                                </div>
                                <div className="sub-question-display-box-item tags-part">
                                    Tags: {tagsDisplay} 
                                </div>
                            </div>

                            <div className="main-questions-display-box-user-page-item">
                                {isTheUser ? <div><Link onClick={() => handleEdit(question._id)} to="#">Edit</Link> <Link onClick={() => handleDelete(question._id)}to="#">Delete</Link></div>: <></>}
                            </div>
                        </div>
                    )
                })
                return (
                    <div key={i}>
                        {questionDisplayReturn}
                    </div>
                )
            })
        )
    }, [])

    return (
        <div className="questions-final-box-flex">

        {userData.questions.length === 0 ? <>No Questions Found</> : !editDisplay.show ? <div>{questionsToDisplay[page]}
            <div>
                <div className="ans-box-subdisplay-item next-prev-ans">
                    <button onClick={handlePrevClick}>prev</button>
                    <button onClick={handleNextClick}>next</button>
                </div>
            </div>
            </div> : editDisplay.display}

        </div>
    )
}

const NewAnswerForm = ({aid, setChangeEdit, handleDelete, handleEdit, isTheUser, userData, setData, setDisplayAnswers}) => {
    const [input, setInput] = useState('')
    const [errors, setErrors] = useState(<></>)
    const handleInput = (e) => {
        e.preventDefault()
        setInput(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = {
            lengthError : input.length === 0 ? "Field cannot be empty!" : false
        }
        const errorsDisplay = Object.values(errors).filter(elem => elem !== false).map((elem, i) => <li key={i}>{elem}</li>)
        if(errorsDisplay.length > 0) {
            setErrors(
                <ul className={"form-ans-unordered-list-error"}>
                    {errorsDisplay}
                </ul>
            )
            setTimeout(() => {
                setErrors(<></>)
            }, 1600)
        } else {
            const token = window.localStorage.getItem("token")
            dbCrud.updateAnswerAll(token, aid, input).then(res => {
                var successDisplay = [<li key={1}>{"Successfully updated"}</li>]
                setErrors(
                    <ul className={"form-ans-unordered-list-success"}>
                        {successDisplay}
                    </ul>
                )
                userCrud.fetchUser(token, userData._id).then(res => {
                    setData(res.data)
                    const newAnswers = res.data.answers;

                    setDisplayAnswers(newAnswers.length === 0 ? <>No Answers Found</>:
                        divideAnArray(newAnswers, 5).map((ansSet, i)=> {
                            const subAnsSet = ansSet.map((ans, j) => {
                                return (
                                    <div key={j}>
                                        <div className="ans-box-subdisplay-item text-ans-by">
                                            <div className="item-ans-box actual-text">
                                                {ans.text}
                                            </div>
                                            <div className="item-ans-box actual-ansby">
                                                <div className="item-ans-box-item-ansby">
                                                    Ans By <span style={{"color":"blue"}}>{ans.user.username}</span>
                                                </div>
                                                <div className="item-ans-box-item-ansby">
                                                    At <span style={{"color":"green"}}>{parseDate(ans.date)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ans-box-subdisplay-item edit-delete-ans">
                                            {isTheUser ? <div><Link onClick={() => handleEdit(ans._id)}to="#">edit</Link> <Link onClick={() => handleDelete(ans._id)} to="#">delete</Link></div> : <></>}
                                        </div>
                                    </div>
                                )
                            })
                            return (
                                <div key={i}className="answer-box-display-flex-item">
                                    {subAnsSet}
                                </div>
                            )
                    })
                )
                }).catch(err => {
                    var errorDisplay = [<li key={1}>{"Did not update answer"}</li>]
                    setErrors(
                        <ul className={"form-ans-unordered-list-error"}>
                            {errorDisplay}
                        </ul>
                    )
                })
                setTimeout(() => {
                    setErrors(<></>)
                    setChangeEdit({show: false, display:<></>})
                }, 1600)
            }).catch(err => {
                var errorDisplay = [<li key={1}>{"Did not update answer"}</li>]
                setErrors(
                    <ul className={"form-ans-unordered-list-error"}>
                        {errorDisplay}
                    </ul>
                )
                setTimeout(() => {
                    setErrors(<></>)
                }, 1200)
            })
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="form-ans-update">
                <div className="form-ans-update-item text-input">
                    <label htmlFor="edit-ans">
                        <textarea onChange={handleInput}value={input} name="edit-ans"></textarea>
                    </label>
                </div>
                <div className="form-ans-update-item button-input">
                    <input type="submit" value={"Update Answer"}/>
                </div>
                {errors}
            </form>
        </div>

    )

}

const AnswersDisplay = ({userData, isTheUser, setData}) => {
    const [displayAnswers, setDisplayAnswers] = useState(<></>)
    const [changeEdit, setChangeEdit] = useState({show: false, display:<></>})
    const handleEdit = (aid) => {
        setChangeEdit({show: true, 
            display: (
                <NewAnswerForm setDisplayAnswers={setDisplayAnswers} isTheUser={isTheUser}setData={setData}userData={userData}handleDelete={handleDelete} handleEdit={handleEdit} setChangeEdit={setChangeEdit}aid={aid}/>
            )})
    }
    const handleDelete = (aid) => {
        if(window.confirm("Are you sure you want to delete this answer?")) {
            const token = window.localStorage.getItem("token")
            dbCrud.deleteAnswer(token, aid).then(res => {
                userCrud.fetchUser(token, userData._id).then(res => {
                    setData(res.data)
                    const newAnswers = res.data.answers;

                    setDisplayAnswers(newAnswers.length === 0 ? <>No Answers Found</>:
                        divideAnArray(newAnswers, 5).map((ansSet, i)=> {
                            const subAnsSet = ansSet.map((ans, j) => {
                                return (
                                    <div key={j}>
                                        <div className="ans-box-subdisplay-item text-ans-by">
                                            <div className="item-ans-box actual-text">
                                                {ans.text}
                                            </div>
                                            <div className="item-ans-box actual-ansby">
                                                <div className="item-ans-box-item-ansby">
                                                    Ans By <span style={{"color":"blue"}}>{ans.user.username}</span>
                                                </div>
                                                <div className="item-ans-box-item-ansby">
                                                    At <span style={{"color":"green"}}>{parseDate(ans.date)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ans-box-subdisplay-item edit-delete-ans">
                                            {isTheUser ? <div><Link onClick={() => handleEdit(ans._id)}to="#">edit</Link> <Link onClick={() => handleDelete(ans._id)} to="#">delete</Link></div> : <></>}
                                        </div>
                                    </div>
                                )
                            })
                            return (
                                <div key={i}className="answer-box-display-flex-item">
                                    {subAnsSet}
                                </div>
                            )
                    })
                )
            }).catch(err => {
                window.alert(`Error: ${err.message}`)
            })
        }).catch(err => {
            window.alert(`Error: ${err.message}`)
        })
    }}

    useEffect(() => {
        setDisplayAnswers(userData.answers.length === 0 ? <>No Answers Found</>:
            divideAnArray(userData.answers, 5).map((ansSet, i)=> {
                const subAnsSet = ansSet.map((ans, j) => {
                    return (
                        <div key={j}>
                            <div className="ans-box-subdisplay-item text-ans-by">
                                <div className="item-ans-box actual-text">
                                    {ans.text}
                                </div>
                                <div className="item-ans-box actual-ansby">
                                    <div className="item-ans-box-item-ansby">
                                        Ans By <span style={{"color":"blue"}}>{ans.user.username}</span>
                                    </div>
                                    <div className="item-ans-box-item-ansby">
                                        At <span style={{"color":"green"}}>{parseDate(ans.date)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="ans-box-subdisplay-item edit-delete-ans">
                                {isTheUser ? <div><Link onClick={() => handleEdit(ans._id)}to="#">edit</Link> <Link onClick={() => handleDelete(ans._id)} to="#">delete</Link></div> : <></>}
                            </div>
                        </div>
                    )
                })
                return (
                    <div key={i}className="answer-box-display-flex-item">
                        {subAnsSet}
                    </div>
                )
        })
    )}, [])
    const [page, setPage] = useState(0)

    const handleNextClick = () =>{
        if(page + 1 < displayAnswers.length) {
            setPage(page + 1)
        }
    }

    const handlePrevClick = () =>{
        if(page - 1 >= 0) {
            setPage(page - 1)
        }
    }
    return (
        <div className="answer-box-display-flex">
        {!changeEdit.show ? <div>{displayAnswers.length > 0 ? 
            <div>
            {displayAnswers[page]}
                <div className="ans-box-subdisplay-item next-prev-ans">
                    <button onClick={handlePrevClick}>prev</button>
                    <button onClick={handleNextClick}>next</button>
                </div>
            </div> : <>No Answers Found</>}
            </div>: changeEdit.display}
        </div>
    )
}

const TagsDisplay = ({userData}) => {
    const tags = divideAnArray(userData.tags, 4);
    const displayTags = tags.map((tagsSet, i)=> {
        const flexInnerItems = tagsSet.map((tag, j) => {
            return (
                <div key={j} className={"tags-box-display-flex-inner-item"}>
                    <div className="text-stuff">
                    <Link to={`/home/questions/tags/${tag._id}`}>{tag.name}</Link><br/>
                    {tag.questions.length === 1 ? `${tag.questions.length} question` : `${tag.questions.length} questions`}
                    </div>
                </div>
            )
        })
        return (<div key={i} className="tags-box-display-flex-item">
                {flexInnerItems}
            </div>)
    })
    return (
        <div className="tags-box-display-flex">
            {userData.tags.length === 0 ? <>No Tags Were Found</>: displayTags}
        </div>
    )
}

const divideAnArray = (newArray, dividingFactor) => {
    const currentAllQCommentsLength = newArray.length !== 0 ? Math.floor(newArray.length / dividingFactor+ 1) : 0

    var toReturn = [] 
    for(let i = 0; i < currentAllQCommentsLength; ++i) {
        var questionCommentBox = []
        for(let j = i * dividingFactor; j < i * dividingFactor+ dividingFactor && j < newArray.length; ++j) {
            questionCommentBox.push(newArray[j])
        }
        toReturn.push(questionCommentBox)
    }
    
    return toReturn.filter(elem => elem.length !== 0)
}

const parseDate = (askDate) => {
    var today = new Date(Date.parse(askDate))
    const askedOn = [today.toLocaleString("default", {month: "long"}).slice(0, 3),
        String(today.getDate()).padStart(2, "0")+",", String(today.getFullYear())].join(" ")
    const askedAt = [String(today.getHours()).padStart(2, "0"), String(today.getMinutes()).padStart(2, "0")].join(":")
    return askedOn + " " + askedAt
}

const SingleUserPageDisplay = ({userData, isTheUser}) => {
    const [data, setData] = useState(userData)
    const [display, setDisplay] = useState(<QuestionsDisplay userData={userData} setData={setData} isTheUser={isTheUser}/>)
    const handleDisplay = (setting) => {
        if(setting === "tags") {
            setDisplay(<TagsDisplay userData={data}/>)
        } else if(setting === "questions") {
            setDisplay(<QuestionsDisplay userData={data} setData={setData} isTheUser={isTheUser}/>)
        } else {
            setDisplay(<AnswersDisplay userData={data} setData={setData} isTheUser={isTheUser}/>)
        }
    }
    return (
        <div>
            <div className="user-page-parts">
                <div className={"user-page-parts-item top-part"}>
                    <div className="top-part-item top-username">
                        {userData.username}
                    </div>
                    <div className="top-part-item top-member-date">
                        Member since {parseDate(userData.creationDate)}
                    </div>
                    <div className="top-part-item top-reputation">
                        Reputation: {userData.reputation}
                    </div>
                </div>
                <div className={"user-page-parts-item bottom-part"}>
                    <div className="bottom-part-item sidebar">
                        <div className="bottom-part-item-sidebar questions">
                            <Link onClick={() => handleDisplay("questions")}to="#">Questions</Link>
                        </div>
                        <div className="bottom-part-item-sidebar answers">
                            <Link onClick={() => handleDisplay("answers")} to="#">Answers</Link>
                        </div>
                        <div className="bottom-part-item-sidebar tags">
                            <Link onClick={() => handleDisplay("tags")}to="#">Tags</Link>
                        </div>
                    </div>
                    <div className="bottom-part-item sidebar-display">
                        <div className="bottom-part-item-display">
                            {display}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SingleUserPage() {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    const { id } = useParams()

    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           const isTheUser = res.data.userid === id
           userCrud.fetchUser(token, id).then(res => {
               setDisplay(<SingleUserPageDisplay userData={res.data} isTheUser={isTheUser} userId={id}/>)
           })
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               userCrud.fetchUser(token, id).then(res => {
                   setDisplay(<SingleUserPageDisplay userData={res.data} isTheUser={false} userId={id}/>)
               })
           }).catch(err => {
               navigate("/welcome")
           })
       })
    }, [])
    return (
        <div>
            <NavigationBar />
            {display}
        </div>
    )
}
