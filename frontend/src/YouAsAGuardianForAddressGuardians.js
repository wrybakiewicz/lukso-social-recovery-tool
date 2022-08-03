import YouAsAGuardianForAddressGuardian from "./YouAsAGuardianForAddressGuardian";
import {Table} from "react-bootstrap";

export default function YouAsAGuardianForAddressGuardians({guardians}) {
    return <Table striped>
        <thead>
        <tr>
            <th>#</th>
            <th>Guardian Address</th>
            <th>New Owner Address</th>
        </tr>
        </thead>
        <tbody>
            {guardians.map(guardian => <YouAsAGuardianForAddressGuardian guardian={guardian}/>)}
        </tbody>
    </Table>
}