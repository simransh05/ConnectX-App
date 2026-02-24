import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import userAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route';

function Home() {
  userAvailable(); // custom hook
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default Home
