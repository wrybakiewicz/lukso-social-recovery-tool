import {IconButton, Tooltip, Typography} from "@mui/material";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./YouAsAGuardianForAddressGuardian.css"
import InfoIcon from "@mui/icons-material/Info";
import {displayAddress} from './ResponsiveUtils'
import {useMediaQuery} from 'react-responsive'
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {toast} from "react-toastify";

export default function RecoveryProcessGuardian({process, contract, guardianDetails, address, updateVoteInParent}) {

    const [isGuardianLoading, setIsGuardianLoading] = useState(true)
    const [voteInput, setVoteInput] = useState('')
    const [isInputAddressValid, setIsInputAddressValid] = useState(false)
    const [voteInProgress, setVoteInProgress] = useState(false)

    const initialize = async () => {
        if(isVoted(guardianDetails.vote) && guardianDetails.guardian === address) {
            setVoteInput(guardianDetails.vote)
        }
        setIsGuardianLoading(false)
    }

    useEffect(_ => {
        initialize()
    }, [])


    const isAddressValid = (address) => {
        return ethers.utils.isAddress(address)
    }

    const isVoted = (address) => {
        return address !== "0x0000000000000000000000000000000000000000"
    }

    const updateAddressInput = (address) => {
        setVoteInput(address)
        if(isAddressValid(address) && guardianDetails.vote !== address) {
            setIsInputAddressValid(true)
        } else {
            setIsInputAddressValid(false)
        }
    }

    const updateVote = () => {
        console.log("Updating vote")
        const newVote = voteInput
        setVoteInProgress(true)
        const updateVotePromise = contract.voteToRecover(process, newVote)
            .then(_ => {
                updateVoteInParent(guardianDetails.index, newVote)
            })
            .finally(_ => {
                setVoteInProgress(false)
            })

        toast.promise(updateVotePromise, {
            pending: 'Voting for address',
            success: 'Voted for address 👌',
            error: 'Vote for address failed 🤯'
        });
    }

    const showFullAddress = useMediaQuery({
        query: '(min-width: 1200px)'
    })

    const url = 'https://explorer.execution.l16.lukso.network/address/'

    const addressLink = (address) => <a href={url + address}
                           target="_blank"
                           className={"rowCenter"}>{displayAddress(address, showFullAddress)}</a>

    const youLink = <a href={url + guardianDetails.guardian}
                       target="_blank" className={"rowCenter"}>You</a>

    const tooltip = <div className={"guardiansInfo"}>
        <Tooltip title={<Typography fontSize={20}>Set address that you want to become new owner of recovering
            account</Typography>} className={"guardiansInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    const newOwnerAddress = () => {
        if (isGuardianLoading) {
            return <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        } else if (guardianDetails.guardian === address) {
            return input
        } else {
            if(isVoted(guardianDetails.vote)) {
                return addressLink(guardianDetails.vote)
            } else {
                return "Not set yet"
            }
        }
    }

    const input = <div>
        <InputGroup>
            {tooltip}
            <Form.Control
                type={"text"}
                placeholder="Address"
                aria-label="Address"
                value={voteInput}
                onChange={(e) => updateAddressInput(e.target.value)}
            />
            <Button variant="primary" onClick={updateVote}
                    disabled={!isInputAddressValid || voteInProgress}>
                Update address
            </Button>
        </InputGroup>
    </div>

    return <tr className={'tableHeight'}>
        <td className={"rowCenter"}>{guardianDetails.index}</td>
        <td className={"rowCenter"}>{guardianDetails.guardian === address ? youLink : addressLink(guardianDetails.guardian)}</td>
        <td className={"rowCenter"}>{newOwnerAddress()}</td>
    </tr>
}