import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {IconButton, Tooltip, Typography} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {useMediaQuery} from "react-responsive";
import {ethers} from "ethers";
import {useState} from "react";
import {toast} from "react-toastify";

export default function StartNewRecoveryProcess({contract, newProcessCreated}) {

    const [inputAddress, setInputAddress] = useState('')
    const [isStartingInProgress, setIsStartingInProgress] = useState(false)

    const newProcessFullScreen = useMediaQuery({
        query: '(max-width: 1700px)'
    })

    const isAddressValid = () => {
        return ethers.utils.isAddress(inputAddress)
    }

    const startRecovery = async () => {
        setIsStartingInProgress(true)
        const processId = ethers.utils.formatBytes32String(Date.now().toString())
        console.log("Setting address " + inputAddress + " processId: " + processId)
        const startRecoveryPromise = contract.voteToRecover(processId, inputAddress)
        toast.promise(startRecoveryPromise, {
            pending: 'Starting recovery process',
            success: 'Recovery process started 👌',
            error: 'Start recoveryProcess failed 🤯'
        }).finally(_ => {
            setIsStartingInProgress(false)
        });
        await startRecoveryPromise
        newProcessCreated()
    }

    const newProcessTooltip = <div className={"guardiansInfo"}>
        <Tooltip
            title={<Typography fontSize={20}>Vote for new address that should have ownership of account</Typography>}
            className={"guardiansInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    return <div className={newProcessFullScreen ? "" : "addressInput"}>
        <InputGroup>
            {newProcessTooltip}
            <Form.Control
                type={"text"}
                placeholder="Address"
                aria-label="Address"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
            />
            <Button variant="primary" onClick={startRecovery}
                    disabled={!isAddressValid() || isStartingInProgress}>
                Set address
            </Button>
        </InputGroup>
    </div>
}