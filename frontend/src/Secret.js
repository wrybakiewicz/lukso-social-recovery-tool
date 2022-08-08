import YourSocialRecovery from "./YourSocialRecovery";
import {IconButton, Tooltip, Typography} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import {keccak256} from "@ethersproject/keccak256";
import {toUtf8Bytes} from "@ethersproject/strings";
import {toast} from "react-toastify";
import './Secret.css'

export default function Secret({contract, contractNotDeployed}) {

    const [secretInput, setSecretInput] = useState('')
    const [secretInputHash, setSecretInputHash] = useState()
    const [isSecretValid, setIsSecretValid] = useState()
    const [isUpdatingSecretHash, setIsUpdatingSecretHash] = useState(false)

    const updateSecretInput = (secret) => {
        setSecretInput(secret)
        const secretHash = keccak256(toUtf8Bytes(secret));
        setSecretInputHash(secretHash)
        if (secret === '') {
            setIsSecretValid(false)
        } else {
            setIsSecretValid(true)
        }
    }

    const updateSecretHash = () => {
        console.log("Updating secret " + secretInputHash)
        setIsUpdatingSecretHash(true)
        const updateSecretPromise = contract.setSecret(secretInputHash)
        toast.promise(updateSecretPromise, {
            pending: 'Updating secret hash',
            success: 'Secret hash updated 👌',
            error: 'Secret hash update failed 🤯'
        }).finally(_ => {
            setIsUpdatingSecretHash(false)
        });
    }

    const tooltip = <div className={"secretInfo"}>
        <Tooltip title={<Typography fontSize={20}>Secret is phase needed to recover your account when minimum guardian
            number - threshold - voted to do so. Save this value in safe location.</Typography>} className={"secretInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    const content = <div className={"secret"}>
        <div className={"secretInput"}>
        <InputGroup className="mb-3">
            {tooltip}
            <Form.Control
                type="text"
                placeholder="New Secret"
                aria-label="New Secret"
                aria-describedby="basic-addon2"
                value={secretInput}
                onChange={e => updateSecretInput(e.target.value)}
            />
            <Button variant="primary" id="button-addon2" onClick={updateSecretHash}
                    disabled={!isSecretValid || isUpdatingSecretHash}>
                Set new secret
            </Button>
        </InputGroup>
        </div>
    </div>
    return <YourSocialRecovery activeKey={2} content={content} contract={contract} contractNotDeployed={contractNotDeployed}/>
}