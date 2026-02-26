import React, { useContext, useEffect, useState } from 'react'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'
import OneOneChat from '../One-One-Chat/OneOneChat'
import api from '../../utils/api'
import { CurrentUserContext } from '../../Context/currentUserProvider'

function Messages() {
  useUserAvailable(`${ROUTES.MESSAGES}`)
  const { currentUser } = useContext(CurrentUserContext);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchMyChatUsers = async () => {
      const res = await api.getMessages(currentUser?._id)
      console.log(res.data);
    }
    fetchMyChatUsers();
  }, [])
  return (
    <div>
      <Navbar />
      <div className="message-container">
        <div className="left-side">
          {/* list of people chat with and sort with latest */}
          {/* list.map then onClick send in the other  */}
        </div>

        <div className="right-side">
          <OneOneChat
            other={user}
          />
        </div>
      </div>

    </div>
  )
}

export default Messages
