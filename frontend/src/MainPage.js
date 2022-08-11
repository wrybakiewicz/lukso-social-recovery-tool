import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled from 'styled-components';
import Header from "./Header";
import './MainPage.css'
import {useNavigate} from "react-router";
import {ethers} from "ethers";

const YourSocialRecoveryLink = styled(Link)`
    text-decoration: none;
    color: #FC766AFF !important;
`;

const YouAsAGuardianLink = styled(Link)`
    text-decoration: none;
    color: #5B84B1FF !important;
`;

export default function MainPage({address, socialRecoveryNotDeployed}) {

    const [viewRecoveryAddress, setViewRecoveryAddress] = useState('')
    const [isViewRecoveryAddressValid, setIsViewRecoveryAddressValid] = useState(false)

    const navigate = useNavigate()

    const updateViewRecoveryAddress = (newAddress) => {
        setViewRecoveryAddress(newAddress)
        if(ethers.utils.isAddress(newAddress)) {
            setIsViewRecoveryAddressValid(true)
        } else {
            setIsViewRecoveryAddressValid(false)
        }
    }

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
                    value={viewRecoveryAddress}
                    onChange={(e) => updateViewRecoveryAddress(e.target.value)}
                    type="text"
                    placeholder="Address"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                />
                <Button variant="primary" id="button-addon2" onClick={() => navigate('/view-recovery/' + viewRecoveryAddress)} disabled={!isViewRecoveryAddressValid}>
                    View recovery
                </Button>
            </InputGroup>
        </div>
        <div className={"left centered-button"}>
            {socialRecoveryNotDeployed ? yourSocialRecovery("deploy") : yourSocialRecovery("guardians")}
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