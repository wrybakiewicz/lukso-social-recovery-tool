import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddressGuardians from "./YouAsAGuardianForAddressGuardians";
import {useMediaQuery} from 'react-responsive'
import {displayAddress} from './ResponsiveUtils'
import Button from "react-bootstrap/Button";
import './YouAsAGuardianForAddress.css'
import {useEffect, useState} from "react";
import StartNewRecoveryProcess from "./StartNewRecoveryProcess";
import {ContractFactory} from "ethers";
import LSP11BasicSocialRecovery
    from "@lukso/lsp-smart-contracts/artifacts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecovery.sol/LSP11BasicSocialRecovery.json";

export default function YouAsAGuardianForAddress({recoveryAccount, signer}) {
    const guardians = ["0xa0cf024d03d05303569be9530422342e1ceaf491", "0xa0cf024d03d05303569be9530422342e1ceaf481", "0xa0cf024d03d05303569be9530422342e1ceaf411"]

    const [startedNewRecoveryProcess, setStartedNewRecoveryProcess] = useState(false)
    const [activeKeys, setActiveKeys] = useState([1])
    const contract = ContractFactory.getContract(recoveryAccount.recoveryContractAddress, LSP11BasicSocialRecovery.abi, signer)
    const [recoveryProcessIdsWithIndices, setRecoveryProcessIdsWithIndices] = useState([])

    const showFullAddress = useMediaQuery({
        query: '(min-width: 600px)'
    })

    useEffect(_ => {
        if(signer){
            updateRecoveryProcessesIds()
        }
    }, [])

    const getNextProcessIndex = () => {
        if(recoveryProcessIdsWithIndices.length === 0) {
            return 1
        }
        const lastIndex = recoveryProcessIdsWithIndices[recoveryProcessIdsWithIndices.length - 1].index
        return lastIndex + 1
    }

    const processOnClick = (e, index) => {
        console.log("Clicked " + index)
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
            <Accordion.Header aria-disabled={true}>New Recovery Process</Accordion.Header>
            <Accordion.Body>
                <StartNewRecoveryProcess contract={contract} newProcessCreated={newRecoveryProcessCreated}/>
            </Accordion.Body>
        </Accordion.Item>
    }

    const process = (processWithIndex) => <Accordion.Item eventKey={processWithIndex.index} onClick={(e) => processOnClick(e, processWithIndex.index)}>
        <Accordion.Header>#{processWithIndex.index} Process</Accordion.Header>
        <Accordion.Body>
            <YouAsAGuardianForAddressGuardians guardians={guardians}/>
        </Accordion.Body>
    </Accordion.Item>

    return <Accordion.Item eventKey={recoveryAccount.index}>
        <Accordion.Header>{displayAddress(recoveryAccount.accountAddress, showFullAddress)}</Accordion.Header>
        <Accordion.Body>
            <div>
                <Accordion activeKey={activeKeys} alwaysOpen flush>
                    {recoveryProcessIdsWithIndices.map(processWithIndex => process(processWithIndex))}
                    {startedNewRecoveryProcess ? newRecoveryProcess() : null}
                    {startedNewRecoveryProcess ? null : startNewRecoveryProcessButton()}
                </Accordion>
            </div>
        </Accordion.Body>
    </Accordion.Item>
}