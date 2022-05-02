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

export default { fetchQuestions, postQuestion };
