import Header from "./Header";
import BackButton from "./BackButton";
import Button from "react-bootstrap/Button";
import './DeployContract.css'
import {ContractFactory} from "ethers";
import LSP11BasicSocialRecovery
    from "@lukso/lsp-smart-contracts/artifacts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecovery.sol/LSP11BasicSocialRecovery.json";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";

export default function DeployContract({signer, setContractAddress}) {

    const [deploying, setDeploying] = useState(false)
    const navigate = useNavigate();

    const deploySocialRecovery = async () => {
        console.log("Deploying social recovery contract")

        const deployPromise = deploy()

        toast.promise(deployPromise, {
            success: 'Deployment successfully 👌',
            error: 'Deployment failed 🤯'
        });

        const contractAddress = await deployPromise
        setContractAddress(contractAddress)
        navigate('/your-social-recovery/guardians')
    }

    const deploy = async () => {
        setDeploying(true)
        const contractFactory = ContractFactory.fromSolidity(LSP11BasicSocialRecovery, signer)
        const address = await signer.getAddress()
        const contract = await contractFactory.deploy(address)
        console.log(contract)
        await addSocialRecoveryContract(contract.deployTransaction.hash)
        console.log("Deployed social recovery contract")
        return contract.address
    }

    const addSocialRecoveryContract = async (hash) => {
        const url = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/addrecoverycontractaddress`
        await axios.post(url, {txHash: hash})
            .then(() => {
                console.log("Successfully added social recovery contract")
            })
    }

    const deployButton = <Button variant="primary" id="button-addon2" className={"deploy-font"}
                                 onClick={deploySocialRecovery}>
        Deploy your social recovery contract
    </Button>

    const deployInProgressButton = <Button variant="primary" id="button-addon2" className={"deploy-font"}
                                           onClick={deploySocialRecovery} disabled>
        <div className={"deployInProgressButton m-2"}>
            <div className="spinner-border" role="status" aria-hidden="true"></div>
            <div className={"ms-2"}>Deploying...</div>
        </div>
    </Button>

    return <div className={"YourSocialRecovery"}>
        <Header/>
        <BackButton color={"left-color"}/>
        <div className={"content deploy"}>
            {deploying ? deployInProgressButton : deployButton}
        </div>

    </div>
}