import React, { useState } from 'react'
import {dbService, storageService} from '../fireBase'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import {deleteObject, ref} from 'firebase/storage'

const Nweet = ({nweetObj, isOwner}) => {
    
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    
    const NweetRef = doc(dbService, "nweets", `${nweetObj.id}`);

    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");

        if(ok){
           await deleteDoc(NweetRef);
           await deleteObject(ref(storageService, nweetObj.attachmentURL));
        }else{
            console.log('not deleted');
        }
    }
    const toggleEditing = () => {
        setEditing(prev => !prev);
    }
    const onChange = (event) => {
        const {target : {value},}= event;
        setNewNweet(value)
    }
    const onSubmit = async (event) => {
        event.preventDefault();
    
        await updateDoc(NweetRef, {
            text : newNweet,
        })

        setEditing(false)
    }

    return(
        <>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input 
                            type='text'
                            value={newNweet} required
                            placeholder='수정할 내용을 입력하세요'
                            onChange={onChange}/>
                        <input 
                            type = 'submit'
                            value= "수정하기"
                            />
                    </form>
                    <button onClick={toggleEditing}>취소</button>
                </>
            ) : (
                <>
                    <h3>{nweetObj.text}</h3>
                    {nweetObj.attachmentURL 
                        && <img src={nweetObj.attachmentURL} width="50px" height="50px" alt='사진'/>}
                    {isOwner && 
                    <>
                        <button onClick={onDeleteClick}>삭제</button>
                        <button onClick={toggleEditing}>수정</button>
                    </>
                    }
                    <br/>
                </>
            )}
            
        </>
    )
}


export default Nweet