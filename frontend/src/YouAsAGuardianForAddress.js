import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddressGuardians from "./YouAsAGuardianForAddressGuardians";
import {useMediaQuery} from 'react-responsive'
import {displayAddress} from './ResponsiveUtils'
import Button from "react-bootstrap/Button";
import './YouAsAGuardianForAddress.css'
import {useState} from "react";

export default function YouAsAGuardianForAddress({recoveryAccount}) {
    const guardians = ["0xa0cf024d03d05303569be9530422342e1ceaf491", "0xa0cf024d03d05303569be9530422342e1ceaf481", "0xa0cf024d03d05303569be9530422342e1ceaf411"]
    const processList = ["1", "2"]

    const [startedNewRecoveryProcess, setStartedNewRecoveryProcess] = useState(false)
    const [activeKeys, setActiveKeys] = useState(['1'])

    const showFullAddress = useMediaQuery({
        query: '(min-width: 600px)'
    })

    const processOnClick = (e, id) => {
        console.log("Clicked " + id)
        console.log(e.target.className)
        if (e.target.className === "accordion-button collapsed") {
            setActiveKeys([...activeKeys, id])
            console.log(activeKeys)
        } else if(e.target.className === "accordion-button") {
            const newActiveKeys = activeKeys.filter(element => element !== id)
            setActiveKeys(newActiveKeys)
            console.log(activeKeys)
        }
    }

    const startNewRecoveryProcess = () => {
        setStartedNewRecoveryProcess(true)
        setActiveKeys([...activeKeys, '3'])
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
            <YouAsAGuardianForAddressGuardians guardians={guardians}/>
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