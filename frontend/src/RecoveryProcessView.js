import RecoveryProcessGuardian from "./RecoveryProcessGuardian";
import {Accordion, InputGroup, OverlayTrigger, Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import {IconButton, Tooltip, Typography} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import "./YouAsAGuardianForAddressProcess.css"
import {keccak256} from "@ethersproject/keccak256";
import {toUtf8Bytes} from "@ethersproject/strings";
import {toast} from "react-toastify";

export default function RecoveryProcessView({
                                                            processWithIndex,
                                                            contract,
                                                            guardiansWithIndices,
                                                            address,
                                                            threshold,
                                                            currentSecretHash,
                                                            accountRecovered
                                                        }) {

    const [guardianDetailsList, setGuardianDetailsList] = useState([])
    const [isShowRecovery, setIsShowRecovery] = useState(false)

    const [isNewSecretWithoutSecretValid, setIsNewSecretWithoutSecretValid] = useState(false)
    const [newSecretWithoutSecretInput, setNewSecretWithoutSecretInput] = useState('')
    const [newSecretWithoutSecretInputHash, setNewSecretWithoutSecretInputHash] = useState('')
    const [isRecoveringWithoutSecret, setIsRecoveringWithoutSecret] = useState(false)

    const [isNewSecretWithSecretValid, setIsNewSecretWithSecretValid] = useState(false)
    const [newSecretWithSecretInput, setNewSecretWithSecretInput] = useState('')
    const [newSecretWithSecretInputHash, setNewSecretWithSecretInputHash] = useState('')
    const [isRecoveringWithSecret, setIsRecoveringWithSecret] = useState(false)

    const [isCurrentSecretValid, setIsCurrentSecretValid] = useState(false)
    const [currentSecretInput, setCurrentSecretInput] = useState('')

    const updateNewSecretWithoutSecretInput = (secret) => {
        setNewSecretWithoutSecretInput(secret)
        const secretHash = calculateHash(secret)
        setNewSecretWithoutSecretInputHash(secretHash)
        if (secret === '' || secretHash === currentSecretHash) {
            setIsNewSecretWithoutSecretValid(false)
        } else {
            setIsNewSecretWithoutSecretValid(true)
        }
    }

    const updateNewSecretWithSecretInput = (secret) => {
        setNewSecretWithSecretInput(secret)
        const secretHash = calculateHash(secret)
        setNewSecretWithSecretInputHash(secretHash)
        if (secret === '' || secretHash === currentSecretHash) {
            setIsNewSecretWithSecretValid(false)
        } else {
            setIsNewSecretWithSecretValid(true)
        }
    }

    const updateCurrentSecretInput = (secret) => {
        setCurrentSecretInput(secret)
        const secretHash = calculateHash(secret)
        if (secretHash === currentSecretHash) {
            setIsCurrentSecretValid(true)
        } else {
            setIsCurrentSecretValid(false)
        }
    }

    const recoverAccountWithoutSecret = async () => {
        console.log("Recovering without secret: " + newSecretWithoutSecretInputHash + " process: " + processWithIndex.process)
        setIsRecoveringWithoutSecret(true)

        const recoverAccountPromise = contract.recoverOwnershipWithoutSecret(processWithIndex.process, newSecretWithoutSecretInputHash)
        toast.promise(recoverAccountPromise, {
            pending: 'Recovering account',
            success: 'Account recovered 👌',
            error: 'Account recover failed 🤯'
        }).then(_ => {
            accountRecovered()
        }).finally(_ => {
            setIsRecoveringWithoutSecret(false)
        });
    }

    const recoverAccountWithSecret = async () => {
        console.log("Recovering with secret: " + newSecretWithSecretInputHash + " process: " + processWithIndex.process)
        setIsRecoveringWithSecret(true)

        const recoverAccountPromise = contract.recoverOwnership(processWithIndex.process, currentSecretInput, newSecretWithSecretInputHash)
        toast.promise(recoverAccountPromise, {
            pending: 'Recovering account',
            success: '🎉 Account recovered 🎉',
            error: 'Account recover failed 🤯'
        }).then(
            accountRecovered()
        ).finally(_ => {
            setIsRecoveringWithSecret(false)
        });
    }

    const calculateHash = (input) => {
        return keccak256(toUtf8Bytes(input));
    }

    const fetchGuardiansData = async () => {
        console.log("Fetching guardians data")
        const guardianDetailsPromiseList = guardiansWithIndices.map(async guardianWithIndex => {
            const vote = await contract.getGuardianVote(processWithIndex.process, guardianWithIndex.guardian)
            return {guardian: guardianWithIndex.guardian, index: guardianWithIndex.index, vote: vote}
        })
        setGuardianDetailsList(await Promise.all(guardianDetailsPromiseList))
    }

    const updateVote = (guardianIndex, vote) => {
        console.log("Updating vote in parent")
        const newGuardianDetailsList = guardianDetailsList.map(guardianDetails => {
            if (guardianDetails.index === guardianIndex) {
                return {guardian: guardianDetails.guardian, index: guardianDetails.index, vote: vote}
            } else {
                return guardianDetails
            }
        })
        setGuardianDetailsList(newGuardianDetailsList)
    }

    const showRecovery = () => {
        const votesForAddress = guardianDetailsList
            .map(_ => _.vote === address ? 1 : 0)
            .reduce((partialSum, element) => partialSum + element, 0)
        if (votesForAddress === guardianDetailsList.length && guardianDetailsList.length >= 2) {
            return recoverWithoutSecret()
        } else if (votesForAddress >= threshold) {
            return recoverWithSecret()
        } else {
            return null
        }
    }

    useEffect(() => {
        fetchGuardiansData().then(_ => setIsShowRecovery(true))
    }, [])

    const processTable = <Table striped bordered>
        <thead>
        <tr>
            <th>#</th>
            <th>Guardian Address</th>
            <th>New Owner Address</th>
        </tr>
        </thead>
        <tbody>
        {guardianDetailsList.map(guardianDetails => <RecoveryProcessGuardian
            key={guardianDetails.index}
            process={processWithIndex.process}
            contract={contract}
            guardianDetails={guardianDetails}
            address={address}
            updateVoteInParent={updateVote}
        />)}
        </tbody>
    </Table>

    const recoveryWithSecretTooltip = () => <div className={"secretInfo"}>
        <Tooltip title={<Typography fontSize={20}>Provide your secret and set new secret for next potential recovery.
            If you forgot your secret - convince all guardians to vote for you.</Typography>} className={"secretInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    const recoverWithSecret = () => <div className={"maxRecoveryWithSecret"}>
        <InputGroup className="mb-3">
            {recoveryWithSecretTooltip()}
            <Form.Control
                type={"text"}
                placeholder="Current secret"
                aria-label="Current secret"
                aria-describedby="basic-addon2"
                value={currentSecretInput}
                onChange={e => updateCurrentSecretInput(e.target.value)}
            />
            <Form.Control
                type={"text"}
                placeholder="New secret"
                aria-label="New secret"
                aria-describedby="basic-addon2"
                value={newSecretWithSecretInput}
                onChange={e => updateNewSecretWithSecretInput(e.target.value)}
            />
            <Button variant="primary" id="button-addon2" onClick={recoverAccountWithSecret}
                    disabled={!isNewSecretWithSecretValid || isRecoveringWithSecret || !isCurrentSecretValid}>
                Recover with secret
            </Button>
        </InputGroup>
    </div>

    const recoveryWithoutSecretTooltip = () => <div className={"secretInfo"}>
        <Tooltip title={<Typography fontSize={20}>Provide new secret for next potential recovery and recover your
            account.</Typography>} className={"secretInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    const recoverWithoutSecret = () => <div className={"maxRecoveryWithoutSecret"}>
        <InputGroup className="mb-3">
            {recoveryWithoutSecretTooltip()}
            <Form.Control
                type={"text"}
                placeholder="New secret"
                aria-label="New secret"
                aria-describedby="basic-addon2"
                value={newSecretWithoutSecretInput}
                onChange={e => updateNewSecretWithoutSecretInput(e.target.value)}
            />
            <Button variant="primary" id="button-addon2" onClick={recoverAccountWithoutSecret}
                    disabled={!isNewSecretWithoutSecretValid || isRecoveringWithoutSecret}>
                Recover without secret
            </Button>
        </InputGroup>
    </div>

    return <div>
        <Accordion.Header>#{processWithIndex.index} Process</Accordion.Header>
        <Accordion.Body>
            {processTable}
            {isShowRecovery ? showRecovery() : null}
        </Accordion.Body>
    </div>
}