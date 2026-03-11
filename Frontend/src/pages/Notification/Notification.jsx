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
import UserAvatar from '../../components/userAvatar/UserAvatar'
import socket from '../../Socket/socket'

function Notification() {
  useUserAvailable(`${ROUTES.NOTIFICATION}`);
  const { currentUser } = useContext(CurrentUserContext);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchNotification = async () => {
      const res = await api.getNotification(currentUser?._id);
      setNotification(res.data);
    }
    fetchNotification();
  }, [currentUser])

  const getNotificationText = (n) => {
    switch (n.type) {
      case "like":
        return `${n.name} liked your post`;

      case "comment":
        return `${n.name} commented on your post`;

      case "follow":
        return `${n.name} started following you`;

      case "message":
        return `${n.name} sent you a message`;

      default:
        return "New notification";
    }
  };

  useEffect(() => {
    socket.on('receiver-notify', ({ sender, receiver, type, postId }) => {
      setNotification(prev => [...prev, { sender, receiver, type, createdAt: new Date.now()
    }])
  })

  return () => {
    socket.off('receiver-notify')
  }
}, [])

const handleDelete = async () => {
  const res = await api.deleteNotify(currentUser?._id);
  console.log(res.data, res.status)
  if (res.status === 200) {
    socket.emit('delete');
    setNotification(null);
  }
}

console.log(notification)
return (
  <>
    <Navbar />
    {notification?.length > 0 ? (
      <div className={style.containerNotify}>
        <div className={style.notifyList}>
          {notification.map((n, idx) => (
            <div className={style.notify} key={idx}>
              <UserAvatar
                user={n}
                size={40}
              />

              <div>{getNotificationText(n)}</div>

              <div>{new Date(n.createdAt).toDateString()} {new Date(n?.createdAt).toTimeString()}</div>
            </div>
          ))}
        </div>
        <button className={style.deleteNotify} onClick={handleDelete}> Delete Notification</button>
      </div>
    ) : (
      <div className={style.notifyContainer}>
        <div className={style.noNotify}>No Notifications</div>
      </div>
    )}

    {/* have all the notifications  (list per person)*/}
    {/* get all the notification */}
  </>
)
}

export default Notification
