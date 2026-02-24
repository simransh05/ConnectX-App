import React from 'react'
import userAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'

function About() {
  userAvailable(`${ROUTES.ABOUT}`)
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default About
