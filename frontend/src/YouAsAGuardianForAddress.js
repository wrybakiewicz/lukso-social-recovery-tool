import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddressGuardians from "./YouAsAGuardianForAddressGuardians";

export default function YouAsAGuardianForAddress() {
    const guardians = ["guardian1", "guardian2"]

    return <div>
        <Accordion defaultActiveKey={['0', '1']} alwaysOpen flush>
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