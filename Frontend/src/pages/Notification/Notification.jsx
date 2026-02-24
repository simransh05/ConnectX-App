import React from 'react'
import userAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'

function Notification() {
  userAvailable(`${ROUTES.NOTIFICATION}`)
  return (
    <div>
      <Navbar />
      {/* have all the notifications  (list per person)*/}
      {/* get all the notification */}
    </div>
  )
}

export default Notification
