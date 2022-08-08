import YouAsAGuardianForAddressGuardian from "./YouAsAGuardianForAddressGuardian";
import {Table} from "react-bootstrap";

export default function YouAsAGuardianForAddressGuardians({process, contract, guardiansWithIndices, address}) {
    return <Table striped bordered>
        <thead>
        <tr>
            <th>#</th>
            <th>Guardian Address</th>
            <th>New Owner Address</th>
        </tr>
        </thead>
        <tbody>
            {guardiansWithIndices.map(guardianWithIndex => <YouAsAGuardianForAddressGuardian key={guardianWithIndex.index} process={process} contract={contract} guardianWithIndex={guardianWithIndex} address={address}/>)}
        </tbody>
    </Table>
}