import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

function Post() {
    // on submit form get all the data with who send this post user id 
    const handleSubmit = (e) => {
        e.preventDefault();
        // await api.postSubmit(data) = data have all things which user add + id user
    }
    return (
        <Dialog>
            <DialogTitle>Create Post</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    {/* images */}
                    {/* caption */}
                </form>

            </DialogContent>


        </Dialog>
    )
}

export default Post
