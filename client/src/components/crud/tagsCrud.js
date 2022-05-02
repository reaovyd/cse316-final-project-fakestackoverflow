import axios from "axios";

const baseURL = "http://localhost:8000"

const fetchTags = async(token) => {
    const tags = await axios.get(`${baseURL}/tags`, {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }); 
    return tags 
}

const fetchSingleTag = async(token, tid) => {
    const tags = await axios.get(`${baseURL}/tags/${tid}`, {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }); 
    return tags 
}

export default { fetchTags, fetchSingleTag };
