import {ContractFactory, ethers} from 'ethers';
import React, {useEffect, useState} from "react";
import axios from "axios";
import LSP11BasicSocialRecovery
    from "@lukso/lsp-smart-contracts/artifacts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecovery.sol/LSP11BasicSocialRecovery.json";
import './App.css'
import Button from 'react-bootstrap/Button';

export default function App() {

    const [signer, setSigner] = useState()
    const [contract, setContract] = useState()
    const [newGuardian, setNewGuardian] = useState()
    const [isGuardian, setIsGuardian] = useState()

    const initialize = async () => {
        console.log("Initializing")
        const etherProvider = new ethers.providers.Web3Provider(window.ethereum);

        await etherProvider.send(
            'eth_requestAccounts',
            [],
        );
        const signer = etherProvider.getSigner();
        const address = await signer.getAddress();
        console.log(address)

        setSigner(signer)

        console.log("Initialized")

        const url = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/getrecoverycontractaddressforaddress?address=0x70ebbe40c41295bc757b50de4325cb53a172f490`
        await axios.get(url)
            .then((response) => {
                console.log(response.data)
            })

        // const url2 = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/addrecoverycontractaddress`
        // await axios.post(url2, {txHash: "0x50977eacc421d5f7b27b5dfc39854ffb8c12286ba49fb2e959b345b3c8f302fa"})
        //     .then((response) => {
        //         console.log(response.data)
        //     })
        //
    }

    const deploySocialRecovery = async () => {
        console.log("Deploying social recovery")
        const contractFactory = ContractFactory.fromSolidity(LSP11BasicSocialRecovery, signer)
        const address = await signer.getAddress()
        const contract = await contractFactory.deploy(address)
        // const contract = await ContractFactory.getContract("0x093a5a8393fc11e23dba19fe41194b1cb78f4132", LSP11BasicSocialRecovery, signer)
        // await contract.setThreshold(1)

        setContract(contract)

        console.log(contract)

        // const threshold = await contract.getGuardiansThreshold()
        // console.log(threshold)
    }

    const addGuardian = async () => {
        console.log("Adding guardian")

        // await contract.addGuardian(newGuardian)
        const contract = await ContractFactory.getContract("0x093a5a8393fc11e23dba19fe41194b1cb78f4132", LSP11BasicSocialRecovery.abi, signer)
        console.log(await contract.getGuardiansThreshold())

        await contract.addGuardian("0x70EbbE40C41295bC757B50dE4325cb53a172F490")
        await contract.setThreshold(1)
        console.log("Added guardian")
    }

    const updateIsGuardian = async (address) => {
        console.log("Updating is guardian: " + address)
        const threshold = await contract.getGuardiansThreshold()
        console.log(threshold)
        console.log("Updated is guardian")
    }

    useEffect(() => {
        initialize()
    }, [])

    // if (!signer) {
    //     return <div>Loading...</div>
    // }

    return <div>
        <div className={"centered-header"}>LUKSO Social recovery</div>
        <div className={"view-recovery"}>
            <input placeholder={"Address"} type={"text"}/>

            <Button variant="primary">View recovery</Button>{' '}

        </div>
        <div className={"left centered-button"}>
            <Button variant="outline-primary btn-lg">Your Social Recovery</Button>{' '}
        </div>
        <div className={"right centered-button"}>
            <Button variant="primary btn-lg">You as a Guardian</Button>{' '}
        </div>
    </div>
    // <div>
    {/*<div>*/
    }
    {/*    <h3>My recovery</h3>*/
    }
    {/*    {contract ? null :*/
    }
    {/*        <div>*/
    }
    {/*            <button onClick={deploySocialRecovery}>Deploy</button>*/
    }
    {/*        </div>*/
    }
    {/*    }}*/
    }
    {/*</div>*/
    }
    {/*</div>*/
    }
}
