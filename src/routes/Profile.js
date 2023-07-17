import React, { useEffect, useState } from 'react';
import authService, { dbCollection, dbService } from '../fireBase';
import { useNavigate } from 'react-router-dom';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import {updateProfile} from 'firebase/auth'


const Profile = ({refreshUser, userObj}) => {

    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const navigate = useNavigate();
    // 로그아웃
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    }

   
    const getMyNweets = async () => {
        const q = query(dbCollection(dbService, "nweets"), 
                        where("creatorId", "==", userObj.uid),
                        // 복합쿼리는 색인(index)이 필요 파이어베이스 사이트에서 색인 설정
                        orderBy("createAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        })
    }

    useEffect(()=>{
        getMyNweets();
    },[])


    const onChange = (event) => {
        const{
            target : {value}
        } = event;

        setNewDisplayName(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        if(userObj.displayName !== newDisplayName){
           await updateProfile(userObj, {displayName : newDisplayName});

            }
            refreshUser();
        }
    


    return(
        <>
            <h1>프로필</h1>
            <form onSubmit = {onSubmit}>
                <input 
                    type = "text" 
                    placeholder = "이름 입력"
                    onChange = {onChange}
                    value = {newDisplayName}/>
                <input
                    type = 'submit'
                    value = "프로필 수정"
                />
            </form>
            <button onClick={onLogOutClick}>로그아웃</button>
        </>
    )
}

export default Profile;