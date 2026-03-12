import React, { useContext, useEffect, useState } from 'react'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'
import OneOneChat from '../One-One-Chat/OneOneChat'
import api from '../../utils/api'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import style from './Messages.module.scss'
import { SelectedUserContext } from '../../Context/SelectedUserProvider'
import UserAvatar from '../../components/userAvatar/UserAvatar'
import { useNavigate, useParams } from 'react-router-dom'

function Messages() {
  const navigate = useNavigate()
  const { userId } = useParams()
  if (userId) {
    useUserAvailable(`${ROUTES.MESSAGES}/${userId}`)
  } else {
    useUserAvailable(`${ROUTES.MESSAGES}`)
  }

  const { currentUser } = useContext(CurrentUserContext);
  const { setSelectedUser } = useContext(SelectedUserContext);
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

  console.log(userId);

  const handleClick = (c) => {
    setSelectedUser(c);
    navigate(`${ROUTES.MESSAGES}/${c?._id}`)
  }

  console.log(myChats)
  return (
    <>
      <Navbar />
      <div className={style["message-container"]}>
        <div className={style["left-side"]}>
          {myChats?.length > 0 ?
            myChats.map(c => (
              <div className={style.people} onClick={() => handleClick(c)} key={c?._id}>
                <UserAvatar
                  user={c}
                  size={50}
                />
                <div>{c?.name}</div>
              </div>
            ))
            :
            <div className={style.noChats}>No Chats</div>}
          {/* list of people chat with and sort with latest */}
          {/* list.map then onClick send in the other  */}
        </div>

        <div className={style["right-side"]}>
          <OneOneChat />
        </div>
      </div>

    </>
  )
}

export default Messages
