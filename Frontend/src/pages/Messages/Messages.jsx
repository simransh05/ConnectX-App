import React from 'react'
import userAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'

function Messages() {
  userAvailable(`${ROUTES.MESSAGES}`)
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default Messages
