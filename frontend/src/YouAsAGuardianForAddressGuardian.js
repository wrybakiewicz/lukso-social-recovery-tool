import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

export default function YouAsAGuardianForAddressGuardian({guardian}) {
    const url = 'https://explorer.execution.l16.lukso.network/address/'

    const guardianVote = <a href={url + 0xa0cf024d03d05303569be9530422342e1ceaf481}
                            target="_blank">{"0xa0cf024d03d05303569be9530422342e1ceaf481"}</a>

    return <ListItem secondaryAction={
        guardian === "0xa0cf024d03d05303569be9530422342e1ceaf481" ? guardianVote : <div>Change</div>
    }>
        <ListItemAvatar>
            <Avatar>
                <SecurityIcon/>
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary={<a href={url + guardian} target="_blank">{guardian}</a>}/>
    </ListItem>
}