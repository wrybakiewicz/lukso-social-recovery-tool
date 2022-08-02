import {List} from "@mui/material";
import Guardian from "./Guardian";
import YouAsAGuardianForAddressGuardian from "./YouAsAGuardianForAddressGuardian";

export default function YouAsAGuardianForAddressGuardians({guardians}) {
    const guardiansList = <div className={"youAsAGuardianGuardianList"}>
        <List>
            {guardians.map(guardian => <div key={guardian}><YouAsAGuardianForAddressGuardian guardian={guardian} /></div>)}
        </List>
    </div>
    return guardiansList
}