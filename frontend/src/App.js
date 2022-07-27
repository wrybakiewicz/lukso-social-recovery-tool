import {ContractFactory, ethers} from 'ethers';
import {useEffect, useState} from "react";
import LSP11BasicSocialRecovery
    from "@lukso/lsp-smart-contracts/artifacts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecovery.sol/LSP11BasicSocialRecovery.json";


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

    if (!signer) {
        return <div>Loading...</div>
    }

    return <div>
        <div>
            <h3>My recovery</h3>
            {contract ? null :
                <div>
                    <button onClick={deploySocialRecovery}>Deploy</button>
                </div>
            }
            <div>
                <h4>Add guardian</h4>
                <input type={"text"} onChange={e => setNewGuardian(e.target.value)}/>
                {newGuardian ? <button onClick={addGuardian}>Add guardian</button> : null}
            </div>
            <div>
                <h4>Is guardian</h4>
                <input type={"text"} onChange={e => updateIsGuardian(e.target.value)}/>
                {isGuardian !== undefined ? isGuardian : null}
            </div>
        </div>
    </div>
}
