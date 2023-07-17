import React, { useState } from 'react';
import authService, {createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../fireBase';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


const Auth = () => {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    const [newAccount, setNewAccount] = useState(true);
    const [err, setErr] = useState("");


    const onChange = (event) => {
        const { target : { name, value },
         } = event;
        if(name === "email"){
            setEmail(value)
        }
        else if(name === "pwd"){
            setPwd(value)
        }
    }



    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            if(newAccount){
                // 계정 생성
                data = await createUserWithEmailAndPassword(authService, email, pwd);
            }else{
                // 로그인
                data = await signInWithEmailAndPassword(authService, email, pwd);
            }  
        } catch (error) {
            console.log(error);
            setErr(error.message)
        }
       
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);
    const onSocialClick = async (event) => {
        const {target : {name}} = event;

        let provider;
        if(name === "google"){
            provider = new GoogleAuthProvider();
        }

        const data = await signInWithPopup(authService, provider);

        console.log(data);
    }


    return(
        <>
            <form onSubmit={onSubmit}>
               <input 
                    type='email' 
                    placeholder='이메일'
                    required
                    value={email}
                    name = "email"
                    onChange={onChange}
                    />
                <input
                    type='password'
                    placeholder='비밀번호'
                    required
                    value={pwd}
                    name = "pwd"
                    onChange={onChange}
                    />
                
                <input 
                    type='submit'
                    value={newAccount ? "계정 생성" : "로그인"}/>
            </form>
            <span onClick={toggleAccount}>{newAccount ? "로그인" : "계정 생성"}</span>
            {/* 에러 메세지 작성 */ err}
            <div>
                <button name = "google" onClick={onSocialClick}>구글로 계속하기</button>
            </div>
        </>
    )
}

export default Auth;