import React from 'react'

function PostShow({ posts }) {
    return (
        <div>
        {posts?.length > 0 ?
            posts?.map(p => (
                <div key={p._id}>
                    <span>{p.name}</span>
                </div>
            )) : 
            <div>No Post Available</div>
            }
        </div>
    )
}

export default PostShow
