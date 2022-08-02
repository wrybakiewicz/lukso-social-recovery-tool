import {List} from "@mui/material";
import YouAsAGuardianForAddressGuardian from "./YouAsAGuardianForAddressGuardian";

export default function YouAsAGuardianForAddressGuardians({guardians}) {
    return <List>
        {guardians.map(guardian => <div key={guardian}><YouAsAGuardianForAddressGuardian guardian={guardian}/></div>)}
    </List>
}