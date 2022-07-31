import {ContractFactory, ethers} from 'ethers';
import React, {useEffect, useState} from "react";
import LSP11BasicSocialRecovery
    from "@lukso/lsp-smart-contracts/artifacts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecovery.sol/LSP11BasicSocialRecovery.json";
import MainPage from "./MainPage";
import {Route, Routes} from "react-router";
import Guardians from "./Guardians";
import Threshold from "./Threshold";
import Secret from "./Secret";
import DeployContract from "./DeployContract";
import axios from "axios";

export default function App() {

    const [signer, setSigner] = useState()
    const [address, setAddress] = useState()
    const [contract, setContract] = useState()
    const [socialRecoveryNotDeployed, setSocialRecoveryNotDeployed] = useState()

    const initialize = async () => {
        console.log("Initializing")
        const etherProvider = new ethers.providers.Web3Provider(window.ethereum);

        await etherProvider.send(
            'eth_requestAccounts',
            [],
        );
        const signer = etherProvider.getSigner();
        const address = await signer.getAddress();
        setSigner(signer)
        setAddress(address)
        console.log(address)
        updateSocialRecoveryContractAddress(address, signer)
        console.log("Initialized")
    }

    const setSocialRecoveryContract = (address, signer) => {
        console.log("Setting contract address " + address)
        const contract = ContractFactory.getContract(address, LSP11BasicSocialRecovery.abi, signer)
        setContract(contract)
        console.log("Set contract")
        console.log(contract)
    }

    const setSocialRecoveryContractByAddress = (address) => {
        setSocialRecoveryContract(address, signer)
    }

    const updateSocialRecoveryContractAddress = (accountAddress, signer) => {
        const url = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/getrecoverycontractaddressforaddress?address=${accountAddress}`
        axios.get(url)
            .then((response) => {
                const address = response.data.deploymentAddress
                console.log("Social recovery contract address: " + address)
                setSocialRecoveryContract(address, signer)
            }).catch(e => {
            console.log("ERROR");
            console.error(e);
            if (e.response.status === 404) {
                console.log("Social recovery contract not deployed")
                setSocialRecoveryNotDeployed(true)
            } else {
                throw e
            }
        })
    }

    useEffect(() => {
        initialize()
    }, [])


    return <Routes>
        <Route path="/your-social-recovery/deploy"
               element={<DeployContract signer={signer} setContractAddress={setSocialRecoveryContractByAddress}/>}/>
        <Route path="/your-social-recovery/guardians" element={<Guardians/>}/>
        <Route path="/your-social-recovery/secret" element={<Secret/>}/>
        <Route path="/your-social-recovery/threshold" element={<Threshold/>}/>
        <Route path="*" element={<MainPage address={address} socialRecoveryNotDeployed={socialRecoveryNotDeployed}/>}/>
    </Routes>
}
