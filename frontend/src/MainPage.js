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

export default function MainPage() {
    return <div className={"MainPage"}>
        <Header />
        <div className={"view-recovery"}>
            <InputGroup className="mb-3 view-recovery-width">
                <Form.Control
                    placeholder="Address"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                />
                <Button variant="primary" id="button-addon2">
                    <ViewRecoveryLink to="about3">View recovery</ViewRecoveryLink>
                </Button>
            </InputGroup>
        </div>
        <div className={"left centered-button"}>
            <Button variant="outline-primary btn-lg"><YourSocialRecoveryLink to="/your-social-recovery">Your Social Recovery</YourSocialRecoveryLink></Button>{' '}
        </div>
        <div className={"right centered-button"}>
            <Button variant="primary btn-lg"><YouAsAGuardianLink to="/about2">You as a Guardian</YouAsAGuardianLink></Button>{' '}
        </div>
    </div>
}