import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useUserAvailable from "../../utils/helper/userAvailable";
import ROUTES from "../../constant/Route/route";
import style from './About.module.scss'
const About = () => {

  useUserAvailable(`${ROUTES.ABOUT}`)
  return (
    <>
      <Navbar />

      <div className={style["about-container"]}>
        <h1 className={style["about-title"]}>About ConnectX</h1>

        <p className={style["about-description"]}>
          ConnectX is a modern social networking platform designed to help users
          connect, share, and communicate in real-time. It combines social media
          interaction with instant messaging to create a seamless digital
          experience.
        </p>

        <div className={style["about-section"]}>
          <h2>Key Features</h2>
          <ul>
            <li>Upload and share photos & videos</li>
            <li>Real-time one-to-one chat messaging</li>
            <li>Follow and connect with other users</li>
            <li>Instant notifications for interactions</li>
            <li>Create posts with captions</li>
            <li> Explore and connect with anyone</li>
          </ul>
        </div>

        <div className={style["about-section"]}>
          <h2>What Makes ConnectX Special?</h2>
          <p>
            ConnectX combines social posting, messaging, and networking into one
            unified platform. Users can build connections, interact through
            content, and communicate instantly all in one place.
          </p>
        </div>

        <div className={style["about-section"]}>
          <h2>Built With</h2>
          <ul>
            <li>Frontend: React.js</li>
            <li>Backend: Node.js & Express.js</li>
            <li>Database: MongoDB</li>
            <li>Real-time Communication: Socket.io</li>
          </ul>
        </div>

        <div className={style["about-footer"]}>
          <p>Connect. Share. Chat. Grow. </p>
        </div>
      </div>
    </>
  );
};

export default About;