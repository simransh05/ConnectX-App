import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import style from './About.module.scss'
const About = () => {

  return (
    <>
      <Navbar />

      <div className={style["about-container"]}>
        <h1 className={style["about-title"]}>About ConnectX</h1>

        <p className={style["about-description"]}>
          ConnectX is a social networking platform where users can share posts,
          follow people, and chat in real time. You can explore content, visit
          profiles, and discover users even without logging in.
        </p>

        <div className={style["about-section"]}>
          <h2>Explore Without Login</h2>
          <ul>
            <li>View public posts from different users</li>
            <li>Visit user profiles</li>
            <li>See likes and comments count</li>
            <li>Search and discover people</li>
          </ul>
          <p>
            You can explore posts and profiles without signing in.
            To like, comment, follow users, or send messages,
            you need to create an account and log in.
          </p>
        </div>

        <div className={style["about-section"]}>
          <h2>Features With Account</h2>
          <ul>
            <li>Create public and private posts</li>
            <li>Like and comment on posts</li>
            <li>Follow and connect with users</li>
            <li>Send real-time messages</li>
            <li>Receive notifications</li>
            <li>Manage and edit your profile</li>
            <li>See posts from people you follow</li>
          </ul>
        </div>

        <div className={style["about-section"]}>
          <h2>How ConnectX Works</h2>
          <p>
            ConnectX allows everyone to explore the platform, but actions like
            posting, liking, commenting, following, and chatting require login.
            This helps keep the platform secure while allowing users to preview
            the experience.
          </p>
        </div>

        <div className={style["about-footer"]}>
          <p>Connect. Share. Chat. Grow.</p>
        </div>
      </div>
    </>
  );
};

export default About;