import React from 'react'
import style from './PostShow.module.scss'
function PostShow({ posts }) {
    console.log(posts);
    return (
        <div className={style.postContainer}>
            {posts?.posts?.length > 0 ?
                posts.posts?.map((p, idx) => (
                    <div key={idx} className={style.postInd}>
                        <img src={p?.photoVideo} alt="Image" className={style.imagePost} />
                        <div className={style.postCaption}>{p?.caption}</div>
                    </div>
                )) :
                <div className={style.noPost}>No Post Available</div>
            }
        </div>
    )
}

export default PostShow
