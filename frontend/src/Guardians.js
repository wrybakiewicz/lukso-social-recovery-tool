import YourSocialRecovery from "./YourSocialRecovery";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './Guardians.css'

export default function Guardians({contract}) {
    const content = <div className={"add-guardian"}>
        <InputGroup className="mb-3">
            <Form.Control
                placeholder="Address"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
            />
            <Button variant="primary" id="button-addon2">
                Add guardian
            </Button>
        </InputGroup>
    </div>
    return <YourSocialRecovery activeKey={1} content={content}/>
}