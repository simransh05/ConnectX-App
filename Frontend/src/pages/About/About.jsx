import React from 'react'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route'
import Navbar from '../../components/Navbar/Navbar'

function About() {
  useUserAvailable(`${ROUTES.ABOUT}`)
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default About
