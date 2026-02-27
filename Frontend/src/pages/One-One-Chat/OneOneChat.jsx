import React, { useContext, useEffect, useState } from 'react'
import api from '../../utils/api'
import { CurrentUserContext } from '../../Context/currentUserProvider';
import UserAvatar from '../../components/userAvatar/UserAvatar';
import style from './OneOneChat.module.scss'

function OneOneChat({ other }) {
  const [chats, setChat] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  const [message, setMessage] = useState("");
  // get chat of that person
  useEffect(() => {
    const fetchChat = async () => {
      if (other != null) {
        const res = await api.getIndividualMessage(currentUser?._id, other?._id)
        console.log(res.data)
        setChat(res.data);
      }
    }
    fetchChat()
  }, [other]);

  console.log(other)

  const handleClick = () => {
    // socket
  }

  return (
    <>
      {/* right side with whom we are chatting onclick */}
      {/* map the chats with them  if currentUser chat them on right else left (scss) */}
      {/* {other ? (
        <div className="chat-section">
          <h3>{other?.name}</h3>
        </div>
      ) : (
        <div className="selectuser">Select the user</div>
      )} */}

      {/* idea is to have the header body footer */}
      <div className={style["chat-header"]}>
        <UserAvatar
          user={currentUser}
        />
        <div>{currentUser?.name}</div>
        <button>:</button>
      </div>
      <div className={style["chat-body"]}>
        <div>hello</div>
        <div>hello</div>
        <div>hello</div>
        {/* space and data */}
      </div>
      <div className={style["chat-footer"]}>
        <input type="text" name='chat' className={style['input-field']} placeholder='Type a message' onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleClick} className={style.buttonSend}>Send</button>
      </div>
    </ >
  )
}

export default OneOneChat
