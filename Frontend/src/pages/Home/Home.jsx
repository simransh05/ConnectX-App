import Navbar from '../../components/Navbar/Navbar'
import useUserAvailable from '../../utils/helper/userAvailable'
import ROUTES from '../../constant/Route/route';
import PostShow from '../../components/PostShow/PostShow';
import { useEffect } from 'react';
import { allPostStore } from '../../Zustand/AllPosts';
import { followStore } from '../../Zustand/Follow';
import { useContext } from 'react';
import style from './Home.module.scss'
import { CurrentUserContext } from '../../Context/currentUserProvider';
import useIndividualPosts from '../../utils/helper/IndividualPosts';

function Home() {
  const { fetchFollowInfo } = followStore();
  const { currentUser } = useContext(CurrentUserContext);
  useEffect(() => {
    if (!currentUser) return;
    fetchFollowInfo(currentUser?._id)
  }, [currentUser?._id])

  const { posts, loading } = useIndividualPosts(undefined, true)

  // console.log(allPosts);
  return (
    <div className={style.homeContainer}>
      <Navbar />
      <PostShow
        loading={loading}
        posts={posts}
        isHome={true}
      />
    </div>
  )
}

export default Home
