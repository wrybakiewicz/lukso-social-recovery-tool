import YourSocialRecovery from "./YourSocialRecovery";
import {IconButton, Tooltip} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function Secret() {
    const content = <div>Secret
        <Tooltip title="Info">
            <IconButton>
                <InfoIcon />
            </IconButton>
        </Tooltip></div>
    return <YourSocialRecovery activeKey={2} content={content}/>
}