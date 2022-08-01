import YourSocialRecovery from "./YourSocialRecovery";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {IconButton, Tooltip, Typography} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import './Threshold.css'

export default function Threshold({contract}) {

    const [thresholdInput, setThresholdInput] = useState('')
    const [isThresholdValid, setIsThresholdValid] = useState()
    const [isUpdatingThreshold, setIsUpdatingThreshold] = useState(false)
    const [guardians, setGuardians] = useState()

    const updateCurrentThreshold = async () => {
        const threshold = (await contract.getGuardiansThreshold()).toNumber()
        console.log(threshold)
        setThresholdInput(threshold)
    }

    const updateGuardians = async () => {
        const guardians = await contract.getGuardians()
        console.log(guardians)
        setGuardians(guardians)
    }

    const updateThresholdInput = (newThreshold) => {
        if (newThreshold > 0 && newThreshold <= guardians.length) {
            setIsThresholdValid(true)
        } else {
            setIsThresholdValid(false)

        }
        setThresholdInput(newThreshold)
    }

    const updateThreshold = () => {
        console.log("Updating threshold " + thresholdInput)
        console.log(thresholdInput)
        setIsUpdatingThreshold(true)
        const updateThresholdPromise = contract.setThreshold(thresholdInput)
        toast.promise(updateThresholdPromise, {
            pending: 'Updating threshold',
            success: 'Threshold updated 👌',
            error: 'Threshold update failed 🤯'
        }).finally(_ => {
            setIsUpdatingThreshold(false)
        });
    }

    useEffect(() => {
        if (contract) {
            updateCurrentThreshold()
            updateGuardians()
        }
    }, [contract])

    const tooltip = <div className={"thresholdInfo"}>
        <Tooltip title={<Typography fontSize={20}>Threshold is minimum guardians number to recover your account with secret</Typography>} className={"thresholdInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    const loading = <div className={"connect-wallet"}>
        Connect your wallet
    </div>

    const content = <div>
        <InputGroup className="mb-3">
            {tooltip}
            <Form.Control
                type={"number"}
                placeholder="Threshold"
                aria-label="Threshold"
                aria-describedby="basic-addon2"
                value={thresholdInput}
                onChange={e => updateThresholdInput(e.target.value)}
            />
            <Button variant="primary" id="button-addon2" onClick={updateThreshold}
                    disabled={!isThresholdValid || isUpdatingThreshold}>
                Set threshold
            </Button>
        </InputGroup>
    </div>
    return <YourSocialRecovery activeKey={3} content={contract ? content : loading}/>
}