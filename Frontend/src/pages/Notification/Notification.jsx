import React from 'react'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'
import { useEffect } from 'react'
import api from '../../utils/api'
import { useContext } from 'react'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import { useState } from 'react'
import style from './Notification.module.scss'

function Notification() {
  useUserAvailable(`${ROUTES.NOTIFICATION}`);
  const { currentUser } = useContext(CurrentUserContext);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      const res = await api.getNotification(currentUser?._id);
      setNotification(res.data);
    }
    fetchNotification();
  },[])

  console.log(notification)
  return (
    <div>
      <Navbar />
      <div className={style.notifyContainer}>
        {notification.length > 0 ?
          notification?.map((n, idx) => (
            <div className={style.notify} key={idx}>{ }</div>
          )): 
          <div className={style.noNotify}>No Notification</div>
          }
      </div>
      {/* have all the notifications  (list per person)*/}
      {/* get all the notification */}
    </div>
  )
}

export default Notification
