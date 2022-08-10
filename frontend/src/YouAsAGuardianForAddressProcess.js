import YouAsAGuardianForAddressGuardian from "./YouAsAGuardianForAddressGuardian";
import {Accordion, InputGroup, Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import {IconButton, Tooltip, Typography} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import "./YouAsAGuardianForAddressProcess.css"

export default function YouAsAGuardianForAddressProcess({
                                                            processWithIndex,
                                                            contract,
                                                            guardiansWithIndices,
                                                            address,
                                                            threshold
                                                        }) {

    const [guardianDetailsList, setGuardianDetailsList] = useState([])
    const [isShowRecovery, setIsShowRecovery] = useState(false)


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
        {guardianDetailsList.map(guardianDetails => <YouAsAGuardianForAddressGuardian
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
                value={null}
                onChange={null}
            />
            <Form.Control
                type={"text"}
                placeholder="New secret"
                aria-label="New secret"
                aria-describedby="basic-addon2"
                value={null}
                onChange={null}
            />
            <Button variant="primary" id="button-addon2" onClick={null}
                    disabled={false}>
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
                value={null}
                onChange={null}
            />
            <Button variant="primary" id="button-addon2" onClick={null}
                    disabled={false}>
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