import YourSocialRecovery from "./YourSocialRecovery";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './Guardians.css'
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {IconButton, List, Tooltip, Typography} from "@mui/material";
import Guardian from "./Guardian";
import InfoIcon from "@mui/icons-material/Info";
import { useMediaQuery } from 'react-responsive'
import axios from "axios";

const {ethers} = require("ethers");

export default function Guardians({contract, contractNotDeployed, address}) {

    const [guardianAddress, setGuardianAddress] = useState('')
    const [addingGuardian, setAddingGuardian] = useState(false)
    const [isAddressValid, setIsAddressValid] = useState(false)
    const [guardians, setGuardians] = useState([])

    const showFullAddress = useMediaQuery({
        query: '(min-width: 1700px)'
    })

    const isVerySmallScreen = useMediaQuery({
        query: '(max-width: 700px)'
    })

    const updateGuardiansOnBackend = async () => {
        console.log("Updating guardians on backend")
        const url = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/changeguardiantoaddress`
        await axios.post(url, {address: address})
            .then(() => {
                console.log("Updated guardians on backend")
            })
    }

    const addGuardian = () => {
        console.log("Adding guardian: " + guardianAddress)
        setAddingGuardian(true)
        const addGuardianPromise = contract.addGuardianWithThresholdUpdate(guardianAddress).then(_ => {
            setGuardianAddress('')
            console.log("Added guardian")
            updateGuardiansOnBackend()
        }).finally(_ => {
            setAddingGuardian(false)
            updateGuardians()
        })

        toast.promise(addGuardianPromise, {
            pending: 'Adding guardian',
            success: 'Added guardian 👌',
            error: 'Add guardian failed 🤯'
        });
    }

    const updateGuardians = async () => {
        const guardians = await contract.getGuardians()
        console.log(guardians)
        setGuardians(guardians)
    }

    const updateAddress = (address) => {
        setGuardianAddress(address)
        if (ethers.utils.isAddress(address) && !isAlreadyAGuardian(address)) {
            setIsAddressValid(true)
        } else {
            setIsAddressValid(false)
        }
    }

    const isAlreadyAGuardian = (address) => {
        const addressLowerCase = address.toLowerCase()
        return guardians.filter(guardian => guardian.toLowerCase() === addressLowerCase).length > 0
    }

    useEffect(() => {
        if (contract) {
            updateGuardians()
        }
    }, [contract])

    const tooltip = <div className={"guardiansInfo"}>
        <Tooltip
            title={<Typography fontSize={20}>Guardians can vote to recover your account. You can recover your account
                with secret phase and minimum guardian votes equal to threshold or by all (minimum 2) guardians voting
                unanimously.</Typography>} className={"guardiansInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    const guardiansList = <div className={"listGuardians"}>
        <List>
            {guardians.map(guardian => <div key={guardian}><Guardian contract={contract} address={guardian}
                                                                     showFullAddress={showFullAddress}
                                                                     isVerySmallScreen={isVerySmallScreen}
                                                                     updateGuardiansOnBackend={updateGuardiansOnBackend}/>
            </div>)}
        </List>
    </div>

    const content = <div className={"guardians"}>
        {guardians.length > 0 ? guardiansList : null}
        <InputGroup className="mb-3">
            {tooltip}
            <Form.Control
                type="text"
                placeholder="Address"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={guardianAddress}
                onChange={e => updateAddress(e.target.value)}
            />
            <Button variant="primary" id="button-addon2" onClick={addGuardian}
                    disabled={addingGuardian || !isAddressValid}>
                Add guardian
            </Button>
        </InputGroup>
    </div>
    return <YourSocialRecovery activeKey={1} content={content} contract={contract}
                               contractNotDeployed={contractNotDeployed}/>
}