import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
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

export default function MainPage({signer}) {

    const [address, setAddress] = useState()

    const initialize = async () => {
        console.log("Initializing MainPage")
        if (signer) {
            const address = await signer.getAddress()
            console.log("Address: " + address)
            setAddress(address)
        }
    }

    useEffect(() => {
        initialize()
    }, [signer])

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
            <YourSocialRecoveryLink to="/your-social-recovery/guardians" className={!address ? "disabled-link" : ""}>
                <Button variant="outline-primary btn-lg" disabled={!address}>
                    Your Social Recovery
                </Button>{' '}
            </YourSocialRecoveryLink>
        </div>
        <div className={"right centered-button"}>
            <YouAsAGuardianLink to="/about2" className={!address ? "disabled-link" : ""}>
                <Button variant="primary btn-lg" disabled={!address}>
                    You as a Guardian
                </Button>{' '}
            </YouAsAGuardianLink>
        </div>
    </div>
}