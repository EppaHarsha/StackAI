import './App.css';
import { useState } from 'react'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import { MyContext } from './MyContext'
import {v1 as uuid} from "uuid";
function App() {
  const[prompt,setPrompt] = useState("");
  const[reply,setReply]=useState(null);
  const[currThreadId,setCurrThreadId]=useState(uuid());
  const [prevChats, setPrevChats] = useState([]); 
  const [newChat, setNewChat] = useState(true);
  const[allThreads,setAllThreads]=useState([]);
  const providerValues = {
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads,setAllThreads
  };
  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
    </div>
  )
}

export default App
