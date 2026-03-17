import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import api from '../../../utils/api';
import style from './Post.module.scss'
import Swal from 'sweetalert2';
import { CurrentUserContext } from '../../../Context/currentUserProvider';

function Post({ open, onClose, onSuccess }) {
    const [preview, setPreview] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const { currentUser } = useContext(CurrentUserContext);
    // on submit form get all the data with who send this post user id 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!preview && !caption) {
                return;
            }
            const formData = new FormData();
            formData.append('caption', caption);
            formData.append('userId', currentUser?._id)
            formData.append('fileType', fileType)
            if (preview) {
                formData.append('photoVideo', file)
            }
            // console.log(formData)
            const res = await api.postUploadPost(formData);
            if (res.status === 200) {
                Swal.fire({
                    title: 'Posted',
                    text: 'Successfully updated password',
                    icon: 'info',
                    timer: 5000,
                    showCancelButton: false,
                    showConfirmButton: false
                })
                onSuccess();
                onClose();
                console.log('here')
            }
        }
        catch (err) {
            console.error(err)
        }
        // = data have all things which user add + id user
    }

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file.size > 15 * 1024 * 1024) {
            alert("Max 15MB allowed");
            return;
        }
        if (!file) return;
        setFile(file)
        setPreview(URL.createObjectURL(file));
        // console.log(file.type)
        setFileType(file.type);
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle className={style.postTitle} sx={{ textAlign: 'center' }}>Create Post</DialogTitle>
                <DialogContent className={style.postContent}>
                    {preview &&
                        <div className={style.imageDiv}>
                            {fileType.startsWith("image") && (
                                <img src={preview} alt="preview" className={style.imagePreview} />
                            )}

                            {fileType.startsWith("video") && (
                                <video src={preview} controls width={200} className={style.imagePreview} />
                            )}
                            <span className={style.remove} onClick={() => {
                                setPreview(null);
                                setFile(null);
                            }}>X</span>
                        </div>

                    }
                    {!preview && <label className={style.inputLabel}>
                        Upload File
                        <input
                            type="file"
                            accept="image/*,video/*"
                            hidden
                            name='file'
                            onChange={handleFile}
                            className={style.inputField}
                        />
                    </label>}
                    <br />
                    {!preview && <div className={style.note}>Note: File should be of less than 15MB </div>}
                    <TextField
                        label='Caption'
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className={style.captionInput}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={onClose} sx={{ textTransform: 'none', fontSize: '16px' }}>Cancel</Button>
                    <Button type='submit' sx={{ textTransform: 'none', fontSize: '16px' }}>Post</Button>
                </DialogActions>
            </form>
        </Dialog >
    )
}

export default Post
