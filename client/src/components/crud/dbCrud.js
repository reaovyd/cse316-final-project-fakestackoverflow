import axios from "axios"

const baseURL = "http://localhost:8000"

const fetchQuestions = async(token) => {
    const questions = await axios.get(`${baseURL}/questions`, {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }); 
    return questions
}

const fetchSingleQuestion = async(token, id) => {
    const question = await axios.get(`${baseURL}/questions/${id}`, {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }); 
    return question 
}

const postQuestion = async(token, title, text, summary, tags) => {
    const headers = {
        title,
        text,
        summary,
        tags,
        authorization: `Bearer ${token}`
    }

    const newQuestion = await axios.post(`${baseURL}/questions`, headers)
    return newQuestion 
}

const postQuestionComment = async(token, comment, qid) => {
    const headers = {
        comment,
        qid,
        authorization: `Bearer ${token}`
    }
    const newComment = await axios.post(`${baseURL}/qcomments`, headers)
    return newComment
}

const postAnswerComment = async(token, comment, aid) => {
    const headers = {
        comment,
        aid,
        authorization: `Bearer ${token}`
    }
    const newComment = await axios.post(`${baseURL}/acomments`, headers)
    return newComment
}

const updateQuestionVote = async(token, qid, sentiment) => {
    const headers = {
        authorization: `Bearer ${token}`
    }
    const updateQuestionVote = await axios.put(`${baseURL}/questions/${qid}/votes/${sentiment}`, headers)
    return updateQuestionVote
}

const updateAnswerVote = async(token, aid, sentiment) => {
    const headers = {
        authorization: `Bearer ${token}`
    }
    const answerVote = await axios.put(`${baseURL}/answers/${aid}/votes/${sentiment}`, headers)
    return answerVote 
}

const postAnswer = async(token, qid, text) => {
    const headers = {
        text,
        qid,
        authorization: `Bearer ${token}`
    }
    const newAnswer = await axios.post(`${baseURL}/answers`, headers)
    return newAnswer 
}

const deleteAnswer = async(token, aid) => {
    const newAnswer = await axios.delete(`${baseURL}/answers/${aid}`, {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }); 
    return newAnswer 
}

const updateAnswerAll = async(token, aid, data) => {
    const headers = {
        authorization: `Bearer ${token}`,
        text: {
            toEdit: true,
            data 
        } 
    }
    const answerVote = await axios.put(`${baseURL}/answers/${aid}`, headers)
    return answerVote 
}

export default { fetchQuestions, postQuestion, fetchSingleQuestion, postQuestionComment , updateQuestionVote, postAnswerComment, updateAnswerVote, postAnswer, deleteAnswer, updateAnswerAll};
