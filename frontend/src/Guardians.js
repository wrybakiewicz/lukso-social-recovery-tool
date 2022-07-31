import YourSocialRecovery from "./YourSocialRecovery";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './Guardians.css'
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
const {ethers} = require("ethers");

export default function Guardians({contract}) {

    const [guardianAddress, setGuardianAddress] = useState('')
    const [addingGuardian, setAddingGuardian] = useState(false)
    const [isAddressValid, setIsAddressValid] = useState(false)
    const [guardians, setGuardians] = useState([])

    const addGuardian = () => {
        console.log("Adding guardian: " + guardianAddress)
        setAddingGuardian(true)
        const addGuardianPromise = contract.addGuardian(guardianAddress).then(_ => {
            setGuardianAddress('')
            console.log("Added guardian")
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
        if(ethers.utils.isAddress(address)) {
            setIsAddressValid(true)
        } else {
            setIsAddressValid(false)
        }
    }

    useEffect(() => {
        if(contract) {
            updateGuardians()
        }
    }, [contract])

    const loading = <div className={"add-guardian connect-wallet"}>
        Connect your wallet
    </div>

    const content = <div className={"guardians"}>
        <div className={"listGuardians"}>{guardians.map(guardian => <div>{guardian}</div>)}</div>
        <InputGroup className="mb-3">
            <Form.Control
                placeholder="Address"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={guardianAddress}
                onChange={e => updateAddress(e.target.value)}
            />
            <Button variant="primary" id="button-addon2" onClick={addGuardian} disabled={addingGuardian || !isAddressValid}>
                Add guardian
            </Button>
        </InputGroup>
    </div>
    return <YourSocialRecovery activeKey={1} content={contract ? content : loading}/>
}