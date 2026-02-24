import React, { useContext } from 'react'
import { CurrentUserContext } from '../../Context/currentUserProvider'
import UserAvatar from '../userAvatar/UserAvatar';

function Sidebar() {
  const { currentUser } = useContext(CurrentUserContext);
  const handleUpdate = () => {
    // convert into the update form data 
  }
  return (
    <div>
      <UserAvatar />
      <div>{currentUser?.name}</div>

      {/* user info */}
      {/* avatar */}
      {/* name */}
      {/* email */}
      {/* linkedln profile */}
      {/* github */}
      {/* facebook */}
      {/* skills list */}
      <button onClick={handleUpdate}>Update</button>
      {/* add the list  */}
      {/* save btn or update btn */}
    </div>
  )
}

export default Sidebar
