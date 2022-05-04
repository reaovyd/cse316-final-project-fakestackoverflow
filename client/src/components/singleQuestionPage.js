import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import dbCrud from './crud/dbCrud';
import {
    Link, useNavigate, useParams
} from "react-router-dom"
import NavigationBar from './navigationBar';
import "./css/singleQuestionPage.css"

const SmallMiddlebar = ({answerCount, voteCount, viewCount, qid}) => {
    const [errors, setErrors] = useState(<></>)
    const [currentVoteCount, setVoteCount] = useState(voteCount)
    const handleUpvote = () => {
        const token = window.localStorage.getItem("token")
        if(token === null || token === undefined) {
            setErrors(<>{"User may be unregistered; please login to vote"}</>)
            setTimeout(() => {
                setErrors(<></>)
            }, 1400)
        } else {
            dbCrud.updateQuestionVote(token,qid, "positive").then(res => {
                setVoteCount(currentVoteCount + 1)
            }).catch(err => {
                setErrors(err.response.data.message)
            })
        }
    }
    const handleDownVote = () => {
        const token = window.localStorage.getItem("token")
        if(token === null || token === undefined) {
            setErrors(<>{"User may be unregistered; please login to vote"}</>)
            setTimeout(() => {
                setErrors(<></>)
            }, 1400)
        } else {
            dbCrud.updateQuestionVote(token,qid, "negative").then(res => {
                setVoteCount(currentVoteCount - 1)
            }).catch(err => {
                setErrors(err.response.data.message)
            })
        }
    }
    return (
       <div className="small-middlebar-name-flex">
            <div className="small-middlebar-name-flex-item">
                {answerCount} {answerCount === 1 ? "answer" : "answers"} 
            </div>
            <div className="small-middlebar-name-flex-item">
                <div className="small-middlebar-text-vote-item">
                {currentVoteCount} {currentVoteCount === 1 ? "vote" : "votes"} 
                </div>
                <div className="small-middlebar-text-vote-item">
                        <button className={"dislike-button"}onClick={handleDownVote}> Dislike</button>
                        <button onClick={handleUpvote}>Like</button>
                </div>
                {errors}
            </div>
            <div className="small-middlebar-name-flex-item">
                {viewCount} {viewCount === 1 ? "view" : "views"} 
            </div>
        </div> 

    )
}

const QCommentInput = ({set, text, placeholder, setErrors, qid, comments, setComments}) => {
    const handleInputChange = (e) => {
        e.preventDefault()
        set(e.target.value)
    }
    const handleEnter = (e) => {
        if(e.key === "Enter") {
            e.preventDefault()
            const commentErrors = {
                commentLengthMaxError : e.target.value > 140 ? "Comment cannot be more than 140 characters!" : false,
                commentEmptyError : e.target.value.length === 0 ? "Comment cannot be empty!" : false,
            }
            var errorsDisplay = Object.values(commentErrors).filter(elem => elem !== false).map((error, i) =><li key={i}className={"comment-errors-question"}>{error}</li>)
            if(errorsDisplay.length > 0) {
               setErrors(<ul className="comment-unordered-list-error">{errorsDisplay}</ul>) 
                setTimeout(() => {
                    setErrors(<></>)
                }, 1600)
            } else {
                const token = window.localStorage.getItem("token")
                dbCrud.postQuestionComment(token, e.target.value, qid).then(res => {
                    var errorsDisplay = [<li key={1}className={"comment-success"}>{"Comment Posted Successfully!"}</li>]
                    set('')
                    setComments(newCommentsCreator(comments, res.data, 3))
                    setErrors(<ul className="comment-unordered-list-success">{errorsDisplay}</ul>) 
                    setTimeout(() => {
                        setErrors(<></>)
                    }, 1600)
                }).catch(err => {
                    console.log(err)
                    var errorsDisplay = [<li key={1}className={"comment-errors-question"}>{err.response.data.message}</li>]
                    setErrors(<ul className="comment-unordered-list-error">{errorsDisplay}</ul>) 
                    setTimeout(() => {
                        setErrors(<></>)
                    }, 1600)
                })
            }
        }
    }
    return (
        <input onChange={handleInputChange} value={text} name="new-q-comment" onKeyPress={handleEnter} placeholder={placeholder}/>
    )
}

const parseDate = (askDate) => {
    var today = new Date(Date.parse(askDate))
    const askedOn = [today.toLocaleString("default", {month: "long"}).slice(0, 3),
        String(today.getDate()).padStart(2, "0")+",", String(today.getFullYear())].join(" ")
    const askedAt = [String(today.getHours()).padStart(2, "0"), String(today.getMinutes()).padStart(2, "0")].join(":")
    return askedOn + " " + askedAt

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
    
    return toReturn
}

const newCommentsCreator = (matrix, newComment, dividingFactor) => {
    var newArray = []
    newArray.push(newComment)
    for (let i = 0; i < matrix.length; ++i) {
        for(let j = 0; j < matrix[i].length; ++j) {
            newArray.push(matrix[i][j])
        }
    }
    return divideAnArray(newArray, dividingFactor)
}

const AllQCommentDisplay = ({qCommentSet}) => {
    const display = qCommentSet.map((comment, i)=> {
        return (
            <div key={i}className="q-comment-set-item">
                <div className="q-comment-itself comments">
                    {comment.comment}
                </div>
                <div className="q-comment-itself commenter">
                   By {comment.user.username}<br/>
                   At {parseDate(comment.date)}
                </div>
            </div>
        )
    })
    return (
        <div className="q-comment-set">
            {display}
        </div>
    )
}

const TopBar = ({title, text, tags, username, mainTime, qComments, qid}) => {
    const [comments, setComments] = useState(qComments)
    const [qCommentInput, setqCommentInput] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const [errors, setErrors] = useState(<></>)
    const [page, setPage] = useState(0)
    useEffect(() => {
        if(qComments.length > 0) {
            setComments(qComments)
        }
        const token = window.localStorage.getItem("token")
        loginCrud.verifyTokenExist(token).then(res => {
            setLoggedIn(true)
        }).catch(err => {
        })
    }, [])

    const handleNextClick = () =>{
        if(page + 1 < comments.length) {
            setPage(page + 1)
        }
    }

    const handlePrevClick = () =>{
        if(page - 1 >= 0) {
            setPage(page - 1)
        }
    }
    return (
        <div className="main-display-single-question-item">
            <div className="sub-display-question-item">
                <div className="display-votes-title-item">
                    {title}
                </div>
            </div>
            <div className="sub-display-question-item">
                <span className="sub-question-text">
                    {text}
                </span>
            </div>
            <div className="sub-display-question-item">
                <div className="sub-display-question-item-tags-asked">
                    <div className="item-tags specific">
                        Tags: {tags.reduce((acc, item) => {return acc + " " + item.name},"")}
                    </div>
                    <div className="item-tags asked-by">
                        Asked By <span className="username">{username}</span><br/> 
                        at <span className="time">{mainTime}</span>
                    </div>
                </div>
            </div>
            <div className="sub-display-question-item">
                {comments.length === 0 ? "No Comments Listed" : <AllQCommentDisplay qCommentSet={comments[page]}/>}
            </div>
            <div className="sub-display-question-item">
                <div className="final-row-question-input-nav">
                    <div className="final-row new-comment">
                        <form>
                            <label htmlFor={"new-q-comment"}>
        {loggedIn === false ? <div>Please <Link to="/login">Log In</Link> To Comment</div>: <QCommentInput set={setqCommentInput} comments={comments} setComments={setComments}text={qCommentInput} setErrors={setErrors} qid={qid} placeholder={"Write A Comment"}/>}
                            </label>
                        </form>
                    </div>
                    <div className="final-row next-prev">
                        <button onClick={handlePrevClick}>Prev</button>
                        <button onClick={handleNextClick}>Next</button>
                    </div>
                </div>
                {errors}
            </div>
        </div>
    )
}

const AllACommentDisplay = ({aCommentSet}) => {
    const displayComments = aCommentSet.map((comment, i) => {
        return (
            <div key={i}>
                <div className="acomment-display-item">
                    <div className="the-actual-comment-item text">
                        {comment.comment}
                    </div>
                    <div className="the-actual-comment-item">
                        By {comment.user.username}<br/>
                        At {parseDate(comment.date)} 
                    </div>
                </div>
                <hr size={1}/>
            </div>
        )
    })
    return (
        <div className={"acomment-display"}>
            <hr size={1}/>
            {displayComments}
        </div>
    )
}

const AnswerDisplayBox = ({singleAnswer}) => {
    const [comments, setComments] = useState(divideAnArray(singleAnswer.aComments, 3).filter(elem => elem.length !== 0))
    const [page, setPage] = useState(0)
    const [inputText, setInput] = useState('')
    const [errors, setErrors] = useState(<></>)
    const [votes, setVotes] = useState(singleAnswer.votes)
    const [voteError, setVoteErrors] = useState(<></>)
    const [notLoggedIn, setNotLoggedIn] = useState(true)
    useEffect(() => {
        setComments(divideAnArray(singleAnswer.aComments, 3).filter(elem => elem.length !== 0))
        const token = window.localStorage.getItem("token")
        loginCrud.verifyTokenExist(token).then(res => {
            setNotLoggedIn(false)
        }).catch(err => {
            setNotLoggedIn(true)
        })
    }, [])
    const handleNextClick = () =>{
        if(page + 1 < comments.length) {
            setPage(page + 1)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = {
            commentEmpty : inputText.length === 0 ? "Comment cannot be empty!" : false,
            commentMax : inputText.length > 140 ? "Comment cannot be over 140 characters!" : false
        }
        var errorsDisplay = Object.values(errors).filter(elem => elem !== false).map((error, i) =><li key={i}className={"comment-errors-question"}>{error}</li>)
        if(errorsDisplay.length > 0) {
            setErrors(<ul className="comment-unordered-list-error">{errorsDisplay}</ul>)
            setTimeout(() => {
                setErrors(<></>)
            }, 1700)
        } else {

            const token = window.localStorage.getItem("token")
            dbCrud.postAnswerComment(token, inputText, singleAnswer._id).then(res => {
            setComments(newCommentsCreator(comments,res.data,3).filter(elem => elem.length !== 0))

            var errorsDisplay = [<li key={1}className={"comment-success"}>{"Comment Posted Successfully!"}</li>]
                setInput('')
            setErrors(<ul className="comment-unordered-list-success">{errorsDisplay}</ul>) 
            setTimeout(() => {
                setErrors(<></>)
            }, 1700)

        }).catch(err => {
            console.log(err.response.data)
                var errorsDisplay = [<li key={1} className={"comment-errors-question"}> {err.response.data.message}</li>]
                setErrors(<ul className="comment-unordered-list-error">{errorsDisplay}</ul>)
                setTimeout(() => {
                    setErrors(<></>)
                }, 1700)
            })
        }
    }

    const handlePrevClick = () =>{
        if(page - 1 >= 0) {
            setPage(page - 1)
        }
    }
    const handleInputChange = (e) => {
        e.preventDefault()
        setInput(e.target.value)
    }
    const handleAnswerUpvote = () => {
        const token = window.localStorage.getItem("token")
        dbCrud.updateAnswerVote(token, singleAnswer._id, "positive").then(res => {
            setVotes(votes + 1)
        }).catch(err => {
            if(err.response && (err.response.data.message === "jwt malformed" || err.response.data.error === "UnregisteredUserError")) {
                setVoteErrors(<div style={{"color": "red"}}>{"Please log in to vote"}</div>)
            } else {
                setVoteErrors(<div style={{"color":"red"}}>{err.response.data.message}</div>)
            }
            setTimeout(() => {
                setVoteErrors(<></>)
            }, 1500)
        })
    }
    const handleAnswerDownvote = () => {
        const token = window.localStorage.getItem("token")
        dbCrud.updateAnswerVote(token, singleAnswer._id, "negative").then(res => {
            setVotes(votes - 1)
        }).catch(err => {
            if(err.response && (err.response.data.message === "jwt malformed" || err.response.data.error === "UnregisteredUserError")) {
                setVoteErrors(<div style={{"color": "red"}}>{"Please log in to vote"}</div>)
            } else {
                setVoteErrors(<div style={{"color":"red"}}>{err.response.data.message}</div>)
            }
            setTimeout(() => {
                setVoteErrors(<></>)
            }, 1500)
        })
    }
    return (
        <div className="single-answer-display-flex">
            <div className="single-answer-first">
                <div className="single-answer-first-vote">
                    <div className="single-answer-first-vote-item">
                        <button onClick={handleAnswerUpvote}>Like</button>
                    </div>
                    <div className="single-answer-first-vote-item">
                        {votes} 
                    </div>
                    <div className="single-answer-first-vote-item">
                        <button onClick={handleAnswerDownvote}>Dislike</button>
                    </div>
                </div>
                <div className="single-answer-first-text">
                    {singleAnswer.text}
                </div>
                <div className="single-answer-first-answerby">
                    <div className="single-answer-first-answerby-item">
                        Answer By {singleAnswer.user.username}
                    </div>
                    <div className="single-answer-first-answerby-item">
                        At {parseDate(singleAnswer.date)}
                    </div>
                </div>
            </div>
            <div className="single-answer-middle">
                {comments.length === 0 ? "No Comments Found" : <AllACommentDisplay aCommentSet={comments[page]}/>}
            </div>
            <div className="single-answer-end">
                <div className="single-answer-end-item">
                    <form onSubmit={handleSubmit}>
                        <label className="a-comment" htmlFor={"a-comment"}>
        {notLoggedIn ? <></> : <input value={inputText} onChange={handleInputChange} placeholder={"Write A Comment"}/>}
                        </label>
                    </form>
                    {errors}
                    {voteError}
                </div>
                <div className="single-answer-end-item buttons">
                    <div className="single-answer-end-item buttons-item">
                        <button onClick={handlePrevClick}>Prev</button>    
                    </div>
                    <div className="single-answer-end-item buttons-item">
                        <button onClick={handleNextClick}>Next</button>    
                    </div>
                </div>
            </div>
        </div>
    )
}

const AnswersDisplayProxy = ({currentAnswers, qid}) => {
    const [answers, setAnswers] = useState(<></>) 
    const [page, setPage] = useState(0)
    useEffect(() => {
        if(currentAnswers.length > 0) {
            setAnswers(currentAnswers.map((elem, i) => {
                const elemArray = elem.map((val, j) => {
                    return (<div key={j}>
                            <AnswerDisplayBox singleAnswer={val}/>
                        </div>)
                })
                return (
                    <div key={i} className="answer-display-flex">
                        {elemArray}
                    </div>
                )
            }))
        }
    }, [])
    const handleNextClick = () =>{
        if(page + 1 < currentAnswers.length) {
            setPage(page + 1)
        }
    }

    const handlePrevClick = () =>{
        if(page - 1 >= 0) {
            setPage(page - 1)
        }
    }

    
    return (
        <div>
            <div className="main-display-single-question-item answers">
                {currentAnswers.length === 0 ? <>No Answers Found</> : answers[page]}
            </div>
            <div className="main-display-single-question-item">
                <div className="to-flex-on-this">
                    <div className="sub-last-row-item">
                        <div className="sub-last-row-item-item">
                            <button onClick={handlePrevClick}>Prev</button>
                        </div>
                        <div className="sub-last-row-item-item">
                            <button onClick={handleNextClick}>Next</button>
                        </div>
                    </div>
                    <div className="sub-last-row-item">
                        <div className="sub-last-row-item-item">
                            <Link to={`/home/questions/${qid}/create`}>Answer Question</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Display = ({singleQuestion}) => {
    // dont need summary console.log("summary", singleQuestion.summary)
    const askDate = singleQuestion.date
    var qComments = singleQuestion.qComments
    qComments.sort((a, b) => {
        return Date.parse(a.date) - Date.parse(b.date) > 0 ? -1 : 1
    })

    const currentAllQCommentsLength = qComments.length !== 0 ? Math.floor(qComments.length / 3 + 1) : 0

    var displayQComments = [] 
    for(let i = 0; i < currentAllQCommentsLength; ++i) {
        var questionCommentBox = []
        for(let j = i * 3; j < i * 3 + 3 && j < qComments.length; ++j) {
            questionCommentBox.push(qComments[j])
        }
        displayQComments.push(questionCommentBox)
    }
    displayQComments = displayQComments.filter(arr => arr.length !== 0) 

    const title = singleQuestion.title 
    const text = singleQuestion.text 
    const tags = singleQuestion.tags 
    const username = singleQuestion.user.username 
    const mainTime = parseDate(askDate) 

    const views = singleQuestion.views
    const votes = singleQuestion.votes
    const answers = singleQuestion.answers
    answers.sort((a, b) => {
        return Date.parse(a.date) - Date.parse(b.date) > 0 ? -1 : 1
    })

    for(let ans of answers) {
        ans.aComments.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date) > 0 ? -1 : 1
        })
    }
    const theArray = divideAnArray(answers, 5).filter(elem => elem.length !== 0)

    return (
        <div className="main-display-single-question">
            <TopBar title={title} text={text} tags={tags} username={username} mainTime={mainTime} qComments={displayQComments} qid={singleQuestion._id}/>
            <div className="main-display-single-question-item">
                <div className="small-middlebar-name">
                    <SmallMiddlebar qid={singleQuestion._id} answerCount={answers.length} voteCount={votes} viewCount={views}/>
                </div>
            </div>
            <AnswersDisplayProxy qid={singleQuestion._id} currentAnswers={theArray}/>
        </div>
    )
}

const SingleQuestionPageDisplay = ({questionId, token}) => {
    const [display, setDisplay] = useState(<></>)
    useEffect(() => {
        dbCrud.fetchSingleQuestion(token, questionId).then(res => {
            const singleQuestion = res.data
            setDisplay(<Display singleQuestion={singleQuestion}/>)
        }).catch(err => {
            // idk maybe go back to welcome
            //console.error(err)
        })
    }, [])
    return (
        <div>
            <NavigationBar />
            {display}
        </div>
    )
}

export default function SingleQuestionPage() {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")
    const { id } = useParams()

    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<SingleQuestionPageDisplay token={token} questionId={id}/>)
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<SingleQuestionPageDisplay token={sessionToken} questionId={id}/>)
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
