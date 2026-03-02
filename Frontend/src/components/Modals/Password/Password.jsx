import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, InputAdornment } from '@mui/material'
import React, { useContext, useState } from 'react'
import api from '../../../utils/api';
import Swal from 'sweetalert2';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CurrentUserContext } from '../../../Context/currentUserProvider';

function Password({ open, onClose }) {
    const { currentUser } = useContext(CurrentUserContext);
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,15}$");

    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [passwordRules, setPasswordRules] = useState({
        lower: false,
        upper: false,
        number: false,
        length: false,
        symbol: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPass(value)
        if (name === "password") {
            setPasswordRules({
                lower: /[a-z]/.test(value),
                upper: /[A-Z]/.test(value),
                number: /[0-9]/.test(value),
                length: value.length >= 8,
                symbol: /[\W_]/.test(value),
            });
        }
    }

    const handleUpdate = async (e) => {
        if (!oldPass.trim() || !newPass.trim() || !confirmPass.trim()) {
            onClose();
            return Swal.fire("Error", "All fields are required", "error");
        }

        if (newPass !== confirmPass) {
            onClose();
            return Swal.fire("Error", "New Password & Confirm Password do not match", "error");
        }

        if (!passwordRegex.test(oldPass)) {
            onClose();
            return Swal.fire("Error", 'invalid type! must be 8–15 characters and include uppercase, lowercase, number, and special character.', 'error')
        }

        if (!passwordRegex.test(newPass)) {
            onClose();
            return Swal.fire("Error", 'invalid type! must be 8–15 characters and include uppercase, lowercase, number, and special character.', 'error')
        }
        if (!passwordRegex.test(confirmPass)) {
            onClose();
            return Swal.fire("Error", 'invalid type! must be 8–15 characters and include uppercase, lowercase, number, and special character.', 'error')
        }

        try {
            const data = {
                userId: currentUser?._id,
                oldPass,
                newPass
            }
            const res = await api.postPassword(data);
            if (res.status === 200) {
                onClose();
                Swal.fire({
                    title: 'Password Change',
                    text: 'Successfully updated password',
                    icon: 'info',
                    timer: 5000,
                    showCancelButton: false,
                    showConfirmButton: false
                })
                setOldPass("");
                setNewPass("");
                setConfirmPass("");
                setShowOldPass(false);
                setShowNewPass(false);
                setShowConfirmPass(false);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleClose = () => {
        onClose();
        setOldPass("");
        setNewPass("");
        setConfirm("");
        setShowOldPass(false);
        setShowNewPass(false);
        setShowConfirmPass(false);

    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: "12px", padding: "20px 25px" } }}
        >
            <DialogTitle sx={{ fontSize: "20px", fontWeight: 600, mb: 2, display: 'flex', justifyContent: 'center' }}>
                Reset Password
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Old Password"
                    type={showOldPass ? "text" : "password"}
                    fullWidth
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    sx={{ marginTop: '5px !important' }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowOldPass(!showOldPass)}>
                                    {showOldPass ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="New Password"
                    name="password"
                    type={showNewPass ? "text" : "password"}
                    fullWidth
                    value={newPass}
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowNewPass(!showNewPass)}>
                                    {showNewPass ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <h4 style={{ padding: 0, margin: 0 }}>Password must contains :- </h4>
                <ul style={{ fontSize: "13px", marginTop: "5px", paddingLeft: "15px" }}>
                    <li style={{ color: passwordRules.lower ? "green" : "red", listStyle: 'none' }}>
                        {passwordRules.lower ? "✔" : "✖"} At least one lowercase letter
                    </li>
                    <li style={{ color: passwordRules.upper ? "green" : "red", listStyle: 'none' }}>
                        {passwordRules.upper ? "✔" : "✖"} At least one uppercase letter
                    </li>
                    <li style={{ color: passwordRules.number ? "green" : "red", listStyle: 'none' }}>
                        {passwordRules.number ? "✔" : "✖"} At least one number
                    </li>
                    <li style={{ color: passwordRules.symbol ? "green" : "red", listStyle: 'none' }}>
                        {passwordRules.symbol ? "✔" : "✖"} At least one special character (# @ % $ ! & *)
                    </li>
                    <li style={{ color: passwordRules.length ? "green" : "red", listStyle: 'none' }}>
                        {passwordRules.length ? "✔" : "✖"} Minimum 8 characters
                    </li>
                </ul>

                <TextField
                    label="Confirm Password"
                    type={showConfirmPass ? "text" : "password"}
                    fullWidth
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                    {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ justifyContent: "space-evenly", mt: 1 }}>
                <Button onClick={handleClose} sx={{ color: "#1976d2", fontWeight: 600, textTransform: 'none', fontSize: '16px' }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleUpdate} sx={{ px: 4, textTransform: 'none', fontSize: '16px' }}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Password
