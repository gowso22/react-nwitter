import React, { useEffect, useState } from 'react';
import {v4 as uuidv4} from 'uuid';


import {dbService, dbAddDoc, dbCollection, storageService} from '../fireBase'
import {onSnapshot, orderBy, query } from 'firebase/firestore';
import Nweet from '../components/Nweet';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';


const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    const [attachment, setAttachment] = useState("");



    // collection nweets의 doc들을 가져옴

    // const getNweets = async () => {
    //    const q = query(dbCollection(dbService, "nweets"));

    //    const querySnapshot = await getDocs(q);

    //    querySnapshot.forEach((doc) => {
    //     const nweetObj = {
    //         ...doc.data(),
    //         id : doc.id,
    //     }

    //     setNweets(prev => [nweetObj, ...prev]);
    //    });
    // }

 

    useEffect(()=> {

        // 실시간 반영
        const q = query(dbCollection(dbService, "nweets"), orderBy("createAt", "desc"));
        onSnapshot(q, (snapshot)=> {
            const nweetArr = snapshot.docs.map((doc) => ({
                id : doc.id,
                ...doc.data(),
            }))
            setNweets(nweetArr);
        })
    },[])


    const onSubmit = async (event) =>{
        event.preventDefault();
        
        let attachmentURL = "";

        if(attachment !== ""){
            // npm install uuid
            // 파일 경로 참조 만들기
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            // storage 참조 경로로 파일 업로드
            const response = await uploadString(fileRef, attachment, "data_url");
            // storage 참조 경로에 있는 파일의 url을 다운로드해서 attachmentURL 변수에 넣어서 업데이트
            attachmentURL = await getDownloadURL(response.ref);
        }
       

        const nweetObj = {
            text : nweet,
            createAt : Date.now(),
            creatorId : userObj.uid,
            attachmentURL,
        }

        await dbAddDoc(dbCollection(dbService, "nweets"), nweetObj);
        
   
       /*
        try{
            // firestore database에 nweets이름의 컬렉션(DB)을 추가
            const docRef = await dbAddDoc(dbCollection(dbService, "nweets"),{
                // input value = nweet인 태그의 값과 date 값을 추가
                text : nweet,
                createAt : Date.now(),
                creatorId : userObj.uid,
            });
           
        }catch(error){
            console.log(error);
        }
        */

        setNweet("");
        setAttachment("");
    };

    const onChange = (e) => {
        const {target : {value} } = e;
        setNweet(value);
    }

    const onFileChange = (event) => {
        const {target : { files }, } = event;
        
        const theFile = files[0];
        const reader = new FileReader();

        

        reader.onloadend =  (finishedEvent) => {
            const {currentTarget : {result}} = finishedEvent;
            setAttachment(result);
        }

        reader.readAsDataURL(theFile);
        
    }

    const onClearAttachment = () => {
        setAttachment("");
    }

    return(
        <>
           <form onSubmit={onSubmit}>
            <input 
                type='text'
                value={nweet}
                placeholder='무슨 일이니?'
                onChange={onChange}
                maxLength={120}/>
            <input 
                type = "file" 
                accept='image/*'
                onChange={onFileChange}/>    
            <input type='submit' value = "nweet" />
            
            {attachment && 
                <>
                    <img src={attachment} width="300px" height="300px" alt='preview'/>
                    <button onClick={onClearAttachment}>Clear</button>
                </>}

           </form>
           <div>
                {nweets.map((nweet, index) => (
                    <Nweet key = {nweet.id} 
                            nweetObj={nweet} 
                            isOwner = {nweet.creatorId === userObj.uid}
                             />
                ))}
           </div>
        </>
    )
}

export default Home;