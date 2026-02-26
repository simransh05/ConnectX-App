import React, { useContext, useEffect, useState } from 'react'
import api from '../../utils/api'
import { CurrentUserContext } from '../../Context/currentUserProvider';

function OneOneChat(other) {
  const [chats, setChat] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);
  // get chat of that person
  useEffect(() => {
    const fetchChat = async () => {
      if (other) {
        const res = await api.getIndividualMessage(currentUser?._id, other)
        console.log(res.data)
      }

    }
    fetchChat()
  }, []);

  return (
    <div>
      {/* right side with whom we are chatting onclick */}
      {/* map the chats with them  if currentUser chat them on right else left (scss) */}
      {other ? (
        <div className="chat-section">
          {/* Your chat UI here */}
          <h3>{other?.name}</h3>
          {/* chat header body and footer */}
        </div>
      ) : (
        <div className="selectuser">Select the user</div>
      )}
    </div >
  )
}

export default OneOneChat
