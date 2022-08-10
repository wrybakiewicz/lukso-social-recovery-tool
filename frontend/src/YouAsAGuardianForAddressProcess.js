import YouAsAGuardianForAddressGuardian from "./YouAsAGuardianForAddressGuardian";
import {Accordion, InputGroup, Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function YouAsAGuardianForAddressProcess({processWithIndex, contract, guardiansWithIndices, address}) {

    const processTable = <Table striped bordered>
        <thead>
        <tr>
            <th>#</th>
            <th>Guardian Address</th>
            <th>New Owner Address</th>
        </tr>
        </thead>
        <tbody>
        {guardiansWithIndices.map(guardianWithIndex => <YouAsAGuardianForAddressGuardian
            key={guardianWithIndex.index}
            process={processWithIndex.process}
            contract={contract}
            guardianWithIndex={guardianWithIndex}
            address={address}/>)}
        </tbody>
    </Table>

    const recoverWithSecret = <div>
        <InputGroup className="mb-3">
            {null}
            <Form.Control
                type={"text"}
                placeholder="Current secret"
                aria-label="Current secret"
                aria-describedby="basic-addon2"
                value={null}
                onChange={null}
            />
            <Form.Control
                type={"text"}
                placeholder="New secret"
                aria-label="New secret"
                aria-describedby="basic-addon2"
                value={null}
                onChange={null}
            />
            <Button variant="primary" id="button-addon2" onClick={null}
                    disabled={false}>
                Recover with secret
            </Button>
        </InputGroup>
    </div>

    const recoverWithoutSecret = <div>
        <InputGroup className="mb-3">
            {null}
            <Form.Control
                type={"text"}
                placeholder="New secret"
                aria-label="New secret"
                aria-describedby="basic-addon2"
                value={null}
                onChange={null}
            />
            <Button variant="primary" id="button-addon2" onClick={null}
                    disabled={false}>
                Recover without secret
            </Button>
        </InputGroup>
    </div>

    return <div>
        <Accordion.Header>#{processWithIndex.index} Process</Accordion.Header>
        <Accordion.Body>
            {processTable}
            {recoverWithSecret}
            {recoverWithoutSecret}
        </Accordion.Body>
    </div>
}