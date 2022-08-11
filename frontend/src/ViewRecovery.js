import {useParams} from "react-router";
import Header from "./Header";
import BackButton from "./BackButton";
import "./ViewRecovery.css"
import {useEffect, useState} from "react";
import axios from "axios";
import {ContractFactory} from "ethers";
import SocialRecovery from "./contracts/SocialRecovery.json";
import {Card} from "react-bootstrap";
import {useMediaQuery} from "react-responsive";
import {displayAddress} from "./ResponsiveUtils";
import RecoveryForAccount from "./RecoveryForAccount";

export default function ViewRecovery({signer}) {

    const [contractAddress, setContractAddress] = useState()
    const [contractNotDeployed, setContractNotDeployed] = useState(false)

    let {address} = useParams();

    const showFullAddress = useMediaQuery({
        query: '(min-width: 600px)'
    })

    useEffect(_ => {
        if (signer) {
            updateSocialRecoveryContractAddress()
        }
    }, [signer])

    const updateSocialRecoveryContractAddress = () => {
        const url = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/getrecoverycontractaddressforaddress?address=${address}`
        axios.get(url)
            .then((response) => {
                const address = response.data.deploymentAddress
                console.log("Social recovery contract address: " + address)
                setContractAddress(address)
            }).catch(e => {
            console.log("Error");
            console.error(e);
            if (e.response.status === 404) {
                console.log("Social recovery contract not deployed")
                setContractNotDeployed(true)
            } else {
                throw e
            }
        })
    }

    const addressHasNoContract = <div className={"connect-wallet"}>
        This address has no social recovery contract
    </div>

    const loading = <div className={"connect-wallet"}>
        Connect your wallet
    </div>

    const content = <div className={"viewRecoveryContent"}>
        <h4 className={"viewRecoveryHeader"}>You are viewing details of social recovery for account</h4>
        <div className={"viewRecoveryAccount"}>
            <Card>
                <Card.Title className={"viewRecoveryAddressHeader"}>
                    {displayAddress(address, showFullAddress)}
                </Card.Title>
                <Card.Body>
                    <RecoveryForAccount contractAddress={contractAddress} signer={signer}/>
                </Card.Body>
            </Card>
        </div>
    </div>

    return <div className={"ViewRecovery"}>
        <Header/>
        <BackButton color={"left-color"}/>
        {contractNotDeployed ? addressHasNoContract : contractAddress ? content : loading}
    </div>
}