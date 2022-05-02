import React, { useState, useEffect} from 'react';
import loginCrud from './crud/loginCrud';
import {
    Link, useNavigate, useParams
} from "react-router-dom"
import NavigationBar from './navigationBar';
import tagsCrud from './crud/tagsCrud';
import './css/tagsPage.css'

const TagBoxesDisplay = ({tags}) => {
    const tagsDisplay = tags.map((subTags, i) => {
        const flexDisplay = subTags.map((tagValue, j)=> {
            return (<div key={j} className="subbox-flex-container-item">
                    <div className="subbox-flex-container-item-item">
                        <Link to={`/home/questions/tags/${tagValue._id}`}>{tagValue.name}</Link>
                    </div>
                    <div className="subbox-flex-container-item-item">
                        {tagValue.questions.length} {tagValue.questions.length === 1 ? "question" : "questions"}
                    </div>
                </div>)
        })
        return (<div className="subbox-flex-container-tags" key={i}>
                {flexDisplay}
            </div>
        )
    })
    return (
        <div className="main-flex-container-tags">
            {tagsDisplay}
        </div>
    )
}

const TagsDisplay = ({token}) => {
    const [display, setDisplay] = useState(<div style={{"textAlign": "center"}}>No Tags Found</div>)
    useEffect(() => {
        tagsCrud.fetchTags(token).then(res => {
            const currentAllTags = res.data
            // FOR DEV 
            const dividingFactor = 4
            const currentAllTagsLength = currentAllTags.length !== 0 ? Math.floor(currentAllTags.length / dividingFactor + 1) : 0
            if(currentAllTagsLength !== 0) {
                var displayTags = [] 
                for(let i = 0; i < currentAllTagsLength; ++i) {
                    var tagBox = []
                    for(let j = i * dividingFactor; j < i * dividingFactor + dividingFactor && j < currentAllTags.length; ++j) {
                        tagBox.push(currentAllTags[j])
                    }
                    displayTags.push(tagBox)
                    setDisplay(<TagBoxesDisplay tags={displayTags}/>)
                }
            }
        }).catch(err => {

        })
    }, [])
    
    return (
        <div>
            <NavigationBar />
            {display}
        </div>
    )
}

export default function TagsPage() {
    const navigate = useNavigate()
    const [display, setDisplay] = useState(<></>)
    const token = window.localStorage.getItem("token")
    const sessionToken = window.sessionStorage.getItem("token")

    useEffect(() => {
       loginCrud.verifyTokenExist(token).then(res => {
           setDisplay(<TagsDisplay token={token}/>)
       }).catch(err => {
           loginCrud.verifyTokenExist(sessionToken).then(res => {
               setDisplay(<TagsDisplay token={sessionToken}/>)
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
