import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddressGuardians from "./YouAsAGuardianForAddressGuardians";
import { useMediaQuery } from 'react-responsive'
import {displayAddress} from './ResponsiveUtils'

export default function YouAsAGuardianForAddress({recoveryAccount}) {
    const guardians = ["0xa0cf024d03d05303569be9530422342e1ceaf491", "0xa0cf024d03d05303569be9530422342e1ceaf481", "0xa0cf024d03d05303569be9530422342e1ceaf411"]

    const showFullAddress = useMediaQuery({
        query: '(min-width: 600px)'
    })

    return  <Accordion.Item eventKey={recoveryAccount.index}>
        <Accordion.Header>{displayAddress(recoveryAccount.accountAddress, showFullAddress)}</Accordion.Header>
        <Accordion.Body>
            <div>
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
        </Accordion.Body>
    </Accordion.Item>
}