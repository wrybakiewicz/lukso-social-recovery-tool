import Header from "./Header";
import BackButton from "./BackButton";
import Button from "react-bootstrap/Button";
import './DeployContract.css'
import {ContractFactory} from "ethers";
import LSP11BasicSocialRecovery
    from "@lukso/lsp-smart-contracts/artifacts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecovery.sol/LSP11BasicSocialRecovery.json";
import {useState} from "react";
import axios from "axios";

export default function DeployContract({signer}) {

    const [contract, setContract] = useState()

    const deploySocialRecovery = async () => {
        console.log("Deploying social recovery contract")
        const contractFactory = ContractFactory.fromSolidity(LSP11BasicSocialRecovery, signer)
        const address = await signer.getAddress()
        const contract = await contractFactory.deploy(address)

        setContract(contract)

        console.log("Deployed social recovery contract")
        console.log(contract)

        addSocialRecoveryContract(contract.deployTransaction.hash)
    }

    const addSocialRecoveryContract = (hash) => {
        const url = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/addrecoverycontractaddress`
        axios.post(url, {txHash: "0x50977eacc421d5f7b27b5dfc39854ffb8c12286ba49fb2e959b345b3c8f302fa"})
            .then((response) => {
                console.log("Successfully added social recovery contract")
            })
    }

    return <div className={"YourSocialRecovery"}>
        <Header/>
        <BackButton color={"left-color"}/>
        <div className={"content deploy"}>
            <Button variant="primary" id="button-addon2" className={"deploy-font"} onClick={deploySocialRecovery}>
                Deploy your social recovery contract
            </Button>
        </div>

    </div>
}