import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import React from 'react'

function Post({ open, onClose }) {
    // on submit form get all the data with who send this post user id 
    const handleSubmit = (e) => {
        e.preventDefault();
        // await api.postSubmit(data) = data have all things which user add + id user
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Post</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    
                    <Button>Add File</Button>
                    {/* images */}
                    {/* caption */}
                    <TextField
                    // value={}
                    />
                </form>

            </DialogContent>


        </Dialog>
    )
}

export default Post
