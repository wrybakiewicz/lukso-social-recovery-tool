import Header from "./Header";
import BackButton from "./BackButton";
import './YouAsAGuardian.css'
import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddress from "./YouAsAGuardianForAddress";

export default function YouAsAGuardian({address}) {

    const content = <div className={"youAsAGuardianContent youAsAGuardianDetails"}>
        <h4 className={"youAsAGuardianHeader"}>You are a guardian for following accounts</h4>
        <div className={"youAsAGuardianList"}>
            <Accordion defaultActiveKey={['0']} alwaysOpen flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>0xa0cf024d03d05303569be9530422342e1ceaf481</Accordion.Header>
                    <Accordion.Body>
                        <YouAsAGuardianForAddress/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>0xa0cf024d03d05303569be9530422342e1ceaf491</Accordion.Header>
                    <Accordion.Body>
                        <YouAsAGuardianForAddress/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>0xa0cf024d03d05303569be9530422342e1ceaf491</Accordion.Header>
                    <Accordion.Body>
                        <YouAsAGuardianForAddress/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>

    const loading = <div className={"connect-wallet"}>
        Connect your wallet
    </div>

    return <div className={"YouAsAGuardian"}>
        <Header/>
        <BackButton color={"left-color"}/>
        {address ? content : loading}

    </div>
}