import axios from "axios"

const baseURL = "http://localhost:8000"

const fetchUser = async(token, uid) => {
    const user = await axios.get(`${baseURL}/users/${uid}`, {
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }); 
    return user 
}

export default { fetchUser }
