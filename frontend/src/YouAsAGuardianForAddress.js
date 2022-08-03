import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddressGuardians from "./YouAsAGuardianForAddressGuardians";

export default function YouAsAGuardianForAddress() {
    const guardians = ["0xa0cf024d03d05303569be9530422342e1ceaf491", "0xa0cf024d03d05303569be9530422342e1ceaf481", "0xa0cf024d03d05303569be9530422342e1ceaf411"]

    return <div>
        <Accordion defaultActiveKey={['0']} alwaysOpen flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>#1 Process</Accordion.Header>
                <Accordion.Body>
                    <YouAsAGuardianForAddressGuardians guardians={guardians}/>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>#2 Process</Accordion.Header>
                <Accordion.Body>
                    <YouAsAGuardianForAddressGuardians guardians={guardians}/>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    </div>
}