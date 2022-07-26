import {Accordion} from "react-bootstrap";
import RecoveryProcessView from "./RecoveryProcessView";
import StartNewRecoveryProcess from "./StartNewRecoveryProcess";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import {ContractFactory} from "ethers";
import SocialRecovery from "./contracts/SocialRecovery.json";
import "./RecoveryForAccount.css"

export default function RecoveryForAccount({contractAddress, signer}) {

    const contract = ContractFactory.getContract(contractAddress, SocialRecovery.abi, signer)
    const newRecoveryProcessText = "New Recovery Process"

    const [address, setAddress] = useState()
    const [threshold, setThreshold] = useState()
    const [secretHash, setSecretHash] = useState()
    const [recoveryProcessIdsWithIndices, setRecoveryProcessIdsWithIndices] = useState()
    const [guardiansWithIndices, setGuardiansWithIndices] = useState()

    const [startedNewRecoveryProcess, setStartedNewRecoveryProcess] = useState(false)
    const [activeKeys, setActiveKeys] = useState([1])
    const [isAddressGuardian, setIsAddressGuardian] = useState()

    const initialize = async () => {
        console.log("Initializing account with guardians & processes")
        const address = await updateAddress()
        updateGuardians(address)
        updateRecoveryProcessesIds()
        updateThreshold()
        updateSecretHash()
    }

    useEffect(_ => {
        initialize()
    }, [])

    const updateAddress = async () => {
        const address = await signer.getAddress()
        setAddress(address)
        return address
    }

    const updateThreshold = async () => {
        const threshold = (await contract.getGuardiansThreshold()).toNumber()
        console.log(threshold)
        setThreshold(threshold)
    }

    const updateSecretHash = async () => {
        const secretHash = (await contract.getSecretHash())
        setSecretHash(secretHash)
    }

    const updateRecoveryProcessesIds = async () => {
        console.log("Updating recovery process ids")
        const idsWithIndices = (await contract.getRecoverProcessesIds()).map((process, index) => {
            return {process: process, index: index + 1}
        })
        console.log(idsWithIndices)
        setRecoveryProcessIdsWithIndices(idsWithIndices)
    }

    const updateGuardians = async (address) => {
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
        updateIsAddressGuardian(guardiansWithIndices, address)
        setGuardiansWithIndices(guardiansWithIndices)
    }

    const updateIsAddressGuardian = (guardiansWithIndices, address) => {
        const matchingGuardian = guardiansWithIndices.filter(guardianWithIndex => guardianWithIndex.guardian.toLowerCase() === address.toLowerCase())
        if (matchingGuardian.length > 0) {
            setIsAddressGuardian(true)
        } else {
            setIsAddressGuardian(false)
        }
    }

    const getNextProcessIndex = () => {
        if (recoveryProcessIdsWithIndices.length === 0) {
            return 1
        }
        const lastIndex = recoveryProcessIdsWithIndices[recoveryProcessIdsWithIndices.length - 1].index
        return lastIndex + 1
    }

    const startNewRecoveryProcess = () => {
        setStartedNewRecoveryProcess(true)
        setActiveKeys([...activeKeys, getNextProcessIndex()])
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

    const newRecoveryProcessCreated = () => {
        console.log("New recovery process created")
        setStartedNewRecoveryProcess(false)
        updateRecoveryProcessesIds()
    }

    const recoveryInfo = () => <div className={"recoveryInfo"}>
        <div>Minimum votes to recover account with secret: <b>{threshold}</b></div>
        {guardiansWithIndices.length >= 2 ?
            <div>Votes to recover account without secret: <b>{guardiansWithIndices.length}</b></div> : null}
    </div>

    const process = (processWithIndex) => <Accordion.Item key={processWithIndex.index} eventKey={processWithIndex.index}
                                                          onClick={(e) => processOnClick(e, processWithIndex.index)}>
        <RecoveryProcessView processWithIndex={processWithIndex} contract={contract}
                             guardiansWithIndices={guardiansWithIndices} address={address}
                             threshold={threshold} currentSecretHash={secretHash} accountRecovered={initialize}/>
    </Accordion.Item>

    const newRecoveryProcess = () => {
        if (isAddressGuardian) {
            const nextIndex = getNextProcessIndex()
            return <Accordion.Item eventKey={nextIndex} onClick={(e) => processOnClick(e, nextIndex)}>
                <Accordion.Header aria-disabled={true}>{newRecoveryProcessText}</Accordion.Header>
                <Accordion.Body>
                    <StartNewRecoveryProcess contract={contract} newProcessCreated={newRecoveryProcessCreated}/>
                </Accordion.Body>
            </Accordion.Item>
        } else {
            return null
        }
    }

    const noRecoveryProcessesForAccount = () => {
        return <div className={"noRecoveryProcesses"}>There is no recovery processes for account</div>
    }

    const startNewRecoveryProcessButton = () => {
        if(isAddressGuardian) {
            return <div className={"startNewRecoveryProcessButton"}>
                <Button variant="primary" id="button-addon2" onClick={startNewRecoveryProcess}
                        disabled={startedNewRecoveryProcess}>
                    Start new recovery process
                </Button>
            </div>
        } else {
            return null
        }
    }

    const content = () => {
        if (address && guardiansWithIndices && recoveryProcessIdsWithIndices && threshold && secretHash) {
            return <div>
                {recoveryInfo()}
                <Accordion activeKey={activeKeys} alwaysOpen flush>
                    {recoveryProcessIdsWithIndices.map(processWithIndex => process(processWithIndex))}
                    {startedNewRecoveryProcess ? newRecoveryProcess() : null}
                    {startedNewRecoveryProcess ? null : startNewRecoveryProcessButton()}
                    {isAddressGuardian === false && recoveryProcessIdsWithIndices.length === 0 ? noRecoveryProcessesForAccount() : null}
                </Accordion>
            </div>
        } else {
            return null
        }
    }

    return content()

}