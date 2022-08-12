import {Accordion} from "react-bootstrap";
import {useMediaQuery} from 'react-responsive'
import {displayAddress} from './ResponsiveUtils'
import './YouAsAGuardianForAddress.css'
import RecoveryForAccount from "./RecoveryForAccount";

export default function YouAsAGuardianForAddress({recoveryAccount, signer}) {

    const showFullAddress = useMediaQuery({
        query: '(min-width: 600px)'
    })

    return <Accordion.Item eventKey={recoveryAccount.index}>
        <Accordion.Header>{displayAddress(recoveryAccount.accountAddress, showFullAddress)}</Accordion.Header>
        <Accordion.Body>
            <RecoveryForAccount contractAddress={recoveryAccount.recoveryContractAddress} signer={signer}/>
        </Accordion.Body>
    </Accordion.Item>
}