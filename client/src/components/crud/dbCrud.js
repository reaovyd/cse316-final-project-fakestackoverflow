import axios from "axios"

const baseURL = "http://localhost:8000"

const fetchQuestions = async(token) => {
    const headers = {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
    }
    const questions = await axios.get(`${baseURL}/questions`, headers) 
    return questions
}

export default { fetchQuestions };
