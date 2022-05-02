import React, { useState, useEffect } from 'react';
import loginCrud from './crud/loginCrud';
import './css/navbar.css'
import {
    Link, useNavigate, useSearchParams
} from "react-router-dom"


// TODO search input should link to 
const SearchInput = () => {
    const [inputText, setInputText] = useState('')
    let [searchParams, setSearchParams] = useSearchParams()
    const handleInput = (e) => {
        e.preventDefault();
        setInputText(e.target.value)
    }
    const handleSearch = (e) => {
        if(e.key === "Enter") {
            setSearchParams({search: e.target.value})
            //console.log(searchParams.get("search"))
        }
    }
    return(
        <input id={"search-bar-exclusive"} onKeyPress={handleSearch} className="input-search" onChange={handleInput} value={inputText} placeholder={" 🔎 Search"}/>
    )
}

const NavigationBar = () => {
    const [loginText, setLoginText] = useState("Login")
    const [loginLink, setLoginLink] = useState("/login")
    const [displaySignUp, setDisplaySignUp] = useState('Sign up') // if not sign up display ask question button
    const [displaySignUpLink, setDisplaySignUpLink] = useState('/signup') // if not sign up display ask question button
    const [displayUserProfile, setDisplayUserProfile] = useState(false)
    const [displayUserProfileLink, setDisplayUserProfileLink] = useState('')
    const [displayUserProfileLinkName, setDisplayUserProfileLinkName] = useState('')

    useEffect(() => {
        const token = window.localStorage.getItem("token")
        loginCrud.verifyTokenExist(token).then(res => {
            if(res.data.permission === "user") {
                setLoginText("Logout")
                setLoginLink("/logout")
                setDisplaySignUp("Create Question")
                setDisplaySignUpLink('/home/questions/create')
                setDisplayUserProfile(true)
                setDisplayUserProfileLink(`/home/users/user/${res.data.userid}`)
                setDisplayUserProfileLinkName(res.data.username)
            }
        }).catch(err => {

        })
    })
    return (
        <div className="nav-bar">
            <header>
                <h3 className="fso-cursor input-search"><span className="unbold">Fake</span>StackOverflow</h3>
                <nav>
                    <ul className="nav-links">
                        <li><Link to="/home/questions">Questions</Link></li>
                        <li><Link to="/home/tags">Tags</Link></li>
        {displayUserProfile ? <li><Link to={`${displayUserProfileLink}`}><span className="signup-color">{displayUserProfileLinkName}</span></Link></li> : <></>}
                        <li><Link to={`${loginLink}`}><span className="login-color">{loginText}</span></Link></li>
                        <li><Link to={`${displaySignUpLink}`}><span className="signup-color">{displaySignUp}</span></Link></li>
                    </ul>
                </nav>
                <SearchInput />
            </header>
        </div>
    )
}

export default NavigationBar;
