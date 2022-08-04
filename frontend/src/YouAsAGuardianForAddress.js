import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddressGuardians from "./YouAsAGuardianForAddressGuardians";
import {useMediaQuery} from 'react-responsive'
import {displayAddress} from './ResponsiveUtils'
import Button from "react-bootstrap/Button";
import './YouAsAGuardianForAddress.css'
import {useState} from "react";
import StartNewRecoveryProcess from "./StartNewRecoveryProcess";
import {ContractFactory} from "ethers";
import LSP11BasicSocialRecovery
    from "@lukso/lsp-smart-contracts/artifacts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecovery.sol/LSP11BasicSocialRecovery.json";

export default function YouAsAGuardianForAddress({recoveryAccount, signer}) {
    const guardians = ["0xa0cf024d03d05303569be9530422342e1ceaf491", "0xa0cf024d03d05303569be9530422342e1ceaf481", "0xa0cf024d03d05303569be9530422342e1ceaf411"]
    const processList = ["1", "2"]

    const [startedNewRecoveryProcess, setStartedNewRecoveryProcess] = useState(false)
    const [activeKeys, setActiveKeys] = useState(['1'])
    const contract = ContractFactory.getContract(recoveryAccount.recoveryContractAddress, LSP11BasicSocialRecovery.abi, signer)

    const showFullAddress = useMediaQuery({
        query: '(min-width: 600px)'
    })

    const processOnClick = (e, id) => {
        console.log("Clicked " + id)
        if (e.target.className === "accordion-button collapsed") {
            setActiveKeys([...activeKeys, id])
        } else if (e.target.className === "accordion-button") {
            const newActiveKeys = activeKeys.filter(element => element !== id)
            setActiveKeys(newActiveKeys)
        }
    }

    const startNewRecoveryProcess = () => {
        setStartedNewRecoveryProcess(true)
        setActiveKeys([...activeKeys, '3'])
    }

    const newRecoveryProcessCreated = () => {
        console.log("New recovery process created")
        setStartedNewRecoveryProcess(false)
    }

    const startNewRecoveryProcessButton = () => <div className={"startNewRecoveryProcessButton"}>
        <Button variant="primary" id="button-addon2" onClick={startNewRecoveryProcess}
                disabled={startedNewRecoveryProcess}>
            Start new recovery process
        </Button>
    </div>


    const newRecoveryProcess = () => <Accordion.Item eventKey="3" onClick={(e) => processOnClick(e, "3")}>
        <Accordion.Header aria-disabled={true}>New Recovery Process</Accordion.Header>
        <Accordion.Body>
            <StartNewRecoveryProcess contract={contract} newProcessCreated={newRecoveryProcessCreated}/>
        </Accordion.Body>
    </Accordion.Item>

    const process = (id) => <Accordion.Item eventKey={id} onClick={(e) => processOnClick(e, id)}>
        <Accordion.Header>#{id} Process</Accordion.Header>
        <Accordion.Body>
            <YouAsAGuardianForAddressGuardians guardians={guardians}/>
        </Accordion.Body>
    </Accordion.Item>

    return <Accordion.Item eventKey={recoveryAccount.index}>
        <Accordion.Header>{displayAddress(recoveryAccount.accountAddress, showFullAddress)}</Accordion.Header>
        <Accordion.Body>
            <div>
                <Accordion activeKey={activeKeys} alwaysOpen flush>
                    {processList.map(processElement => process(processElement))}
                    {startedNewRecoveryProcess ? newRecoveryProcess() : null}
                    {startedNewRecoveryProcess ? null : startNewRecoveryProcessButton()}
                </Accordion>
            </div>
        </Accordion.Body>
    </Accordion.Item>
}