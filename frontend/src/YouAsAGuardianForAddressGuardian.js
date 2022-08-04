import {IconButton, Tooltip, Typography} from "@mui/material";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./YouAsAGuardianForAddressGuardian.css"
import InfoIcon from "@mui/icons-material/Info";
import {displayAddress} from './ResponsiveUtils'
import { useMediaQuery } from 'react-responsive'

export default function YouAsAGuardianForAddressGuardian({guardian}) {

    const showFullAddress = useMediaQuery({
        query: '(min-width: 1200px)'
    })

    const url = 'https://explorer.execution.l16.lukso.network/address/'

    const addressLink = <a href={url + guardian}
                            target="_blank" className={"rowCenter"}>{displayAddress(guardian, showFullAddress)}</a>

    const youLink = <a href={url + guardian}
                       target="_blank" className={"rowCenter"}>You</a>

    const tooltip = <div className={"guardiansInfo"}>
        <Tooltip title={<Typography fontSize={20}>Set address that you want to become new owner of recovering
            account</Typography>} className={"guardiansInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    const input = <div>
        <InputGroup>
            {tooltip}
            <Form.Control
                type={"text"}
                placeholder="Address"
                aria-label="Address"
                value={null}
                onChange={null}
            />
            <Button variant="primary" onClick={null}
                    disabled={true}>
                Update address
            </Button>
        </InputGroup>
    </div>

    return <tr className={'tableHeight'}>
        <td className={"rowCenter"}>{guardian === '0xa0cf024d03d05303569be9530422342e1ceaf481' ? "2" : guardian === "0xa0cf024d03d05303569be9530422342e1ceaf411" ? "3" : "1"}</td>
        <td className={"rowCenter"}>{guardian === '0xa0cf024d03d05303569be9530422342e1ceaf491' ? youLink : addressLink}</td>
        <td className={"rowCenter"}>{guardian === '0xa0cf024d03d05303569be9530422342e1ceaf481' ? addressLink : guardian === "0xa0cf024d03d05303569be9530422342e1ceaf411" ? "Not set yet" : input}</td>
    </tr>
}