import React, { useContext, useEffect, useState } from 'react'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'
import OneOneChat from '../One-One-Chat/OneOneChat'
import api from '../../utils/api'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import style from './Messages.module.scss'

function Messages() {
  useUserAvailable(`${ROUTES.MESSAGES}`)
  const { currentUser } = useContext(CurrentUserContext);
  const [user, setUser] = useState(null);
  const [myChats, setMyChats] = useState(null);
  useEffect(() => {
    const fetchMyChatUsers = async () => {
      if (currentUser) {
        const res = await api.getMessages(currentUser?._id)
        console.log(res.data);
        setMyChats(res.data);
      }
    }
    fetchMyChatUsers();
  }, [currentUser])
  return (
    <div>
      <Navbar />
      <div className={style["message-container"]}>
        <div className={style["left-side"]}>
          {myChats?.length > 0 ?
            myChats.map(c => (
              <div className={style.people} onClick={() => setUser(c)}>
                <span>{c.sendBy._id === currentUser?._id ? c.sendTo : c.sendBy}</span>
              </div>
            )) :

            <div className={style.noChats}>No Chats</div>}
          {/* list of people chat with and sort with latest */}
          {/* list.map then onClick send in the other  */}
        </div>

        <div className={style["right-side"]}>
          <OneOneChat
            other={user}
          />
        </div>
      </div>

    </div>
  )
}

export default Messages
