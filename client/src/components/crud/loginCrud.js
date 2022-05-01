import axios from 'axios'

const baseURL = `http://localhost:8000`

const verifyTokenExist = async (token) => {
    const headers = {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
    }
    const tokenVerify = await axios.post(`${baseURL}/token_verify`, headers)
    return tokenVerify
}

const createAccount = async (username, password, email) => {
    const headers = {
        username,
        password,
        email
    }
    const newAccount = await axios.post(`${baseURL}/users/signup`, headers) 
    return newAccount 
}

const loginAccount = async (email, password) => {
    const headers = {
        email,
        password
    }
    const login = await axios.post(`${baseURL}/users/login/user`, headers)
    return login
}

const getGuestToken = async () => {
    const getToken = await axios.post(`${baseURL}/users/login/guest`)
    return getToken
}

export default { verifyTokenExist, getGuestToken, createAccount, loginAccount }; 
