import {Avatar, IconButton, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from "react-toastify";
import {useState} from "react";
import {displayAddress} from './ResponsiveUtils'

export default function Guardian({contract, address, showFullAddress, isVerySmallScreen}) {
    const [removeInProgress, setRemoveInProgress] = useState(false)
    const [removed, setRemoved] = useState(false)

    const url = 'https://explorer.execution.l16.lukso.network/address/' + address

    const deleteGuardian = () => {
        console.log("Deleting " + address)
        setRemoveInProgress(true)
        const deleteGuardianPromise = contract.removeGuardian(address).then(_ => {
            setRemoved(true)
        }).catch(e => {
            console.log("Error deleting guardian: " + address)
            console.error(e)
            throw e
        }).finally(_ => {
            setRemoveInProgress(false)
        })
        toast.promise(deleteGuardianPromise, {
            pending: 'Removing guardian',
            success: 'Guardian Removed 👌',
            error: 'Guardian remove failed 🤯'
        });
        console.log("Deleted " + address)
    }

    if(removed) {
        return null
    }

    return <ListItem secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={deleteGuardian} disabled={removeInProgress}>
            <DeleteIcon />
        </IconButton>
    }>
        {isVerySmallScreen ? null : <ListItemAvatar>
            <Avatar>
                <SecurityIcon/>
            </Avatar>
        </ListItemAvatar>}
        <ListItemText primary={<a href={url} target="_blank">{displayAddress(address, showFullAddress)}</a>}/>
    </ListItem>
}