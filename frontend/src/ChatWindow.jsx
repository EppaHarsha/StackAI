import { useContext, useEffect, useState } from 'react';
import Chat from './Chat';
import './ChatWindow.css'
import { MyContext } from './MyContext.jsx';
import {ScaleLoader} from 'react-spinners'
function ChatWindow(){
    const [loading ,setLoading]=useState(false);
    const[isOpen,setIsOpen] = useState(false);
    const{prompt,setPrompt, reply,setReply,currThreadId,prevChats,setPrevChats,setNewChat}=useContext(MyContext)
    const getReply = async()=>{
        setLoading(true);
        setNewChat(false);
        const options={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                threadId:currThreadId,
                message:prompt,
            })
        }
        try {
            const response = await fetch("http://localhost:3000/api/chat", options);
            const res = await response.json();
            setLoading(false);
            console.log("res",res);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
    }
    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats=>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },
                {
                    role:"assistant",
                    content:reply
                }
            ]
            ))
        }
        setPrompt("");
    },[reply])
     const handleProfileClick=()=>{
        setIsOpen(!isOpen)
     }
    return (
        <>
        <div className="chatWindow">
            <div className="navbar">
                <span>StackAI <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }

            <Chat/>
            <ScaleLoader  color='#fff' loading={loading}>

            </ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder='Ask anything' value={prompt} onChange={(e)=>setPrompt(e.target.value)}
                    onKeyDown={(e)=>e.key=='Enter' ? getReply():''} />
                    <div id="submit" onClick={getReply}> <i className="fa-solid fa-paper-plane"></i> </div>
                </div>
                <div className="info">
                    StackAI an make mistakes. Check important info. See Cookie Preferences.
                </div>
            </div>
        </div>
        </>
    )
}
export default ChatWindow;