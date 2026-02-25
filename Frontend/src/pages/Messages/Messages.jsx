import React from 'react'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'

function Messages() {
  useUserAvailable(`${ROUTES.MESSAGES}`)
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default Messages
