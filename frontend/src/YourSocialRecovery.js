import "./YourSocialRecovery.css"
import Header from "./Header";
import BackButton from "./BackButton";
import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function YourSocialRecovery() {
    return <div className={"YourSocialRecovery"}>
        <Header/>
        <BackButton color={"left-color"}/>
        <Nav justify variant="tabs" activeKey={1} className={"navbar-width"}>
            <Nav.Link eventKey="1" as={Link} to="/your-social-recovery/guardians" className={"navbar-padding"}>Guardians</Nav.Link>
            <Nav.Link eventKey="2" as={Link} to="/your-social-recovery/features">Secret</Nav.Link>
            <Nav.Link eventKey="3" as={Link} to="/your-social-recovery/pricing">Threshold</Nav.Link>
        </Nav>
    </div>
}