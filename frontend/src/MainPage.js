import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled from 'styled-components';
import Header from "./Header";
import './MainPage.css'
import axios from "axios";

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
    const [socialRecoveryContractAddress, setSocialRecoveryContractAddress] = useState()
    const [socialRecoveryNotDeployed, setSocialRecoveryNotDeployed] = useState()

    const initialize = async () => {
        console.log("Initializing MainPage")
        if (signer) {
            const address = await signer.getAddress()
            console.log("Address: " + address)
            setAddress(address)
            updateSocialRecoveryContractAddress(address)
        }
    }

    const updateSocialRecoveryContractAddress = (address) => {
        const url = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/getrecoverycontractaddressforaddress?address=${address}`
        axios.get(url)
            .then((response) => {
                const address = response.data
                console.log("Social recovery contract address: " + address)
                setSocialRecoveryContractAddress(address)
            }).catch(e => {
            if (e.response.status === 404) {
                console.log("Social recovery contract not deployed")
                setSocialRecoveryNotDeployed(true)
            } else {
                console.error(e)
                throw e
            }
        })
    }

    useEffect(() => {
        initialize()
    }, [signer])

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
            <YouAsAGuardianLink to="/about2" className={!address ? "disabled-link" : ""}>
                <Button variant="primary btn-lg" disabled={!address}>
                    You as a Guardian
                </Button>{' '}
            </YouAsAGuardianLink>
        </div>
    </div>
}