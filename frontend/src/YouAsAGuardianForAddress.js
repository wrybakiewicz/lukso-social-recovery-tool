import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddressProcess from "./YouAsAGuardianForAddressProcess";
import {useMediaQuery} from 'react-responsive'
import {displayAddress} from './ResponsiveUtils'
import Button from "react-bootstrap/Button";
import './YouAsAGuardianForAddress.css'
import {useEffect, useState} from "react";
import StartNewRecoveryProcess from "./StartNewRecoveryProcess";
import {ContractFactory} from "ethers";
import SocialRecovery from "./contracts/SocialRecovery.json";

export default function YouAsAGuardianForAddress({recoveryAccount, signer, address}) {
    const [startedNewRecoveryProcess, setStartedNewRecoveryProcess] = useState(false)
    const [activeKeys, setActiveKeys] = useState([1])
    const [recoveryProcessIdsWithIndices, setRecoveryProcessIdsWithIndices] = useState()
    const [guardiansWithIndices, setGuardiansWithIndices] = useState()
    const [threshold, setThreshold] = useState()

    const contract = ContractFactory.getContract(recoveryAccount.recoveryContractAddress, SocialRecovery.abi, signer)
    const newRecoveryProcessText = "New Recovery Process"

    const showFullAddress = useMediaQuery({
        query: '(min-width: 600px)'
    })

    useEffect(_ => {
        if (signer) {
            updateGuardians()
            updateRecoveryProcessesIds()
            updateThreshold()
        }
    }, [])

    const updateThreshold = async () => {
        const threshold = (await contract.getGuardiansThreshold()).toNumber()
        console.log(threshold)
        setThreshold(threshold)
    }

    const getNextProcessIndex = () => {
        if (recoveryProcessIdsWithIndices.length === 0) {
            return 1
        }
        const lastIndex = recoveryProcessIdsWithIndices[recoveryProcessIdsWithIndices.length - 1].index
        return lastIndex + 1
    }

    const processOnClick = (e, index) => {
        if (e.target.innerHTML === newRecoveryProcessText && e.target.className === "accordion-button") {
            setStartedNewRecoveryProcess(false)
        }
        if (e.target.className === "accordion-button collapsed") {
            setActiveKeys([...activeKeys, index])
        } else if (e.target.className === "accordion-button") {
            const newActiveKeys = activeKeys.filter(element => element !== index)
            setActiveKeys(newActiveKeys)
        }
    }

    const updateRecoveryProcessesIds = async () => {
        console.log("Updating recovery process ids")
        const idsWithIndices = (await contract.getRecoverProcessesIds()).map((process, index) => {
            return {process: process, index: index + 1}
        })
        console.log(idsWithIndices)
        setRecoveryProcessIdsWithIndices(idsWithIndices)
    }

    const updateGuardians = async () => {
        console.log("Updating guardians")
        const guardians = await contract.getGuardians()
        const sortedGuardians = guardians.slice().sort((a, b) => {
            if (b === address) {
                return 1
            } else {
                return a.localeCompare(b)
            }
        })
        const guardiansWithIndices = sortedGuardians.map((guardian, index) => {
            return {guardian: guardian, index: index + 1}
        })
        console.log(guardiansWithIndices)
        setGuardiansWithIndices(guardiansWithIndices)
    }

    const startNewRecoveryProcess = () => {
        setStartedNewRecoveryProcess(true)
        setActiveKeys([...activeKeys, getNextProcessIndex()])
    }

    const newRecoveryProcessCreated = () => {
        console.log("New recovery process created")
        setStartedNewRecoveryProcess(false)
        updateRecoveryProcessesIds()
    }

    const startNewRecoveryProcessButton = () => <div className={"startNewRecoveryProcessButton"}>
        <Button variant="primary" id="button-addon2" onClick={startNewRecoveryProcess}
                disabled={startedNewRecoveryProcess}>
            Start new recovery process
        </Button>
    </div>


    const newRecoveryProcess = () => {
        const nextIndex = getNextProcessIndex()
        return <Accordion.Item eventKey={nextIndex} onClick={(e) => processOnClick(e, nextIndex)}>
            <Accordion.Header aria-disabled={true}>{newRecoveryProcessText}</Accordion.Header>
            <Accordion.Body>
                <StartNewRecoveryProcess contract={contract} newProcessCreated={newRecoveryProcessCreated}/>
            </Accordion.Body>
        </Accordion.Item>
    }

    const process = (processWithIndex) => <Accordion.Item key={processWithIndex.index} eventKey={processWithIndex.index}
                                                          onClick={(e) => processOnClick(e, processWithIndex.index)}>
        <YouAsAGuardianForAddressProcess processWithIndex={processWithIndex} contract={contract}
                                         guardiansWithIndices={guardiansWithIndices} address={address} threshold={threshold}/>
    </Accordion.Item>

    const recoveryInfo = () => <div className={"recoveryInfo"}>
        <div>Minimum votes to recover account with secret: <b>{threshold}</b></div>
        {guardiansWithIndices.length >= 2 ?
            <div>Votes to recover account without secret: <b>{guardiansWithIndices.length}</b></div> : null}
    </div>

    const content = () => {
        if(guardiansWithIndices && recoveryProcessIdsWithIndices && threshold) {
            return <div>
                {recoveryInfo()}
                <Accordion activeKey={activeKeys} alwaysOpen flush>
                    {recoveryProcessIdsWithIndices.map(processWithIndex => process(processWithIndex))}
                    {startedNewRecoveryProcess ? newRecoveryProcess() : null}
                    {startedNewRecoveryProcess ? null : startNewRecoveryProcessButton()}
                </Accordion>
            </div>
        } else {
            return null
        }
    }

    return <Accordion.Item eventKey={recoveryAccount.index}>
        <Accordion.Header>{displayAddress(recoveryAccount.accountAddress, showFullAddress)}</Accordion.Header>
        <Accordion.Body>
            {content()}
        </Accordion.Body>
    </Accordion.Item>
}