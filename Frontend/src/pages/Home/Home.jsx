import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route';

function Home() {
  useUserAvailable(`${ROUTES.HOME}`); // custom hook
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default Home
