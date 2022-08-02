import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React from "react";
import {Link} from "react-router-dom";
import styled from 'styled-components';
import Header from "./Header";
import './MainPage.css'

const YourSocialRecoveryLink = styled(Link)`
    text-decoration: none;
    color: #FC766AFF !important;
`;

const YouAsAGuardianLink = styled(Link)`
    text-decoration: none;
    color: #5B84B1FF !important;
`;

const ViewRecoveryLink = YouAsAGuardianLink;

export default function MainPage({address, socialRecoveryNotDeployed}) {

    const yourSocialRecovery = (link) => <YourSocialRecoveryLink to={"/your-social-recovery/" + link}
                                                                 className={!address ? "disabled-link" : ""}>
        <Button variant="outline-primary btn-lg" disabled={!address}>
            Your Social Recovery
        </Button>{' '}
    </YourSocialRecoveryLink>


    return <div className={"MainPage"}>
        <Header/>
        <div className={"view-recovery"}>
            <InputGroup className="mb-3 view-recovery-width">
                <Form.Control
                    placeholder="Address"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                />
                <ViewRecoveryLink to="about3">
                    <Button variant="primary" id="button-addon2">
                        View recovery
                    </Button>
                </ViewRecoveryLink>
            </InputGroup>
        </div>
        <div className={"left centered-button"}>
            {socialRecoveryNotDeployed ? yourSocialRecovery("deploy"): yourSocialRecovery("guardians")}
        </div>
        <div className={"right centered-button"}>
            <YouAsAGuardianLink to="/your-as-a-guardian" className={!address ? "disabled-link" : ""}>
                <Button variant="primary btn-lg" disabled={!address}>
                    You as a Guardian
                </Button>{' '}
            </YouAsAGuardianLink>
        </div>
    </div>
}