import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React from 'react'

function Password({ open, onClose }) {
    const handleChange = (e) => {
        e.preventDefault();
        // api
        onClose();
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleChange}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label='Old Password'
                    />
                    <TextField
                        label='New Password'
                    />
                    <TextField
                        label='Confirm Password'
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type='submit'>Update</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default Password
