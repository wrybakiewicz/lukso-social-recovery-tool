import Header from "./Header";
import BackButton from "./BackButton";
import Button from "react-bootstrap/Button";
import './DeployContract.css'
import {ContractFactory} from "ethers";
import SocialRecovery from "./contracts/SocialRecovery.json";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {IconButton, Tooltip, Typography} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {keccak256} from "@ethersproject/keccak256";
import {toUtf8Bytes} from "@ethersproject/strings";

export default function DeployContract({signer, updateContract, contractNotDeployed}) {

    const [deploying, setDeploying] = useState(false)
    const [secretInput, setSecretInput] = useState('')
    const [secretInputHash, setSecretInputHash] = useState()
    const [isSecretValid, setIsSecretValid] = useState()

    const navigate = useNavigate();

    if (!contractNotDeployed) {
        navigate('/your-social-recovery/guardians')
    }

    const updateSecretInput = (secret) => {
        setSecretInput(secret)
        const secretHash = keccak256(toUtf8Bytes(secret));
        setSecretInputHash(secretHash)
        if (secret === '') {
            setIsSecretValid(false)
        } else {
            setIsSecretValid(true)
        }
    }

    const deploySocialRecovery = async () => {
        console.log("Deploying social recovery contract")
        console.log(secretInputHash)

        const deployPromise = deploy().finally(_ => {
            setDeploying(false)
        })

        toast.promise(deployPromise, {
            success: 'Deployment successfully 👌',
            error: 'Deployment failed 🤯'
        });

        await deployPromise
        updateContract()
        navigate('/your-social-recovery/guardians')
    }

    const deploy = async () => {
        setDeploying(true)
        const contractFactory = ContractFactory.fromSolidity(SocialRecovery, signer)
        const address = await signer.getAddress()
        const contract = await contractFactory.deploy(address, secretInputHash)
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

    const info = <div className={"connect-wallet"}>
        Deploy your social recovery contract
    </div>

    const secretTooltip = <div className={"secretInfo"}>
        <Tooltip title={<Typography fontSize={20}>Secret is phase needed to recover your account when minimum guardian
            number - threshold - voted to do so. Save this value in safe location.</Typography>}
                 className={"secretInfo"}>
            <IconButton>
                <InfoIcon/>
            </IconButton>
        </Tooltip>
    </div>

    const deployContent = <div>
        <div className={"secretInput"}>
            <InputGroup className="mb-3">
                {secretTooltip}
                <Form.Control
                    type="text"
                    placeholder="Secret"
                    aria-label="Secret"
                    aria-describedby="basic-addon2"
                    value={secretInput}
                    onChange={e => updateSecretInput(e.target.value)}
                />
                <Button variant="primary" id="button-addon2" onClick={deploySocialRecovery}
                        disabled={!isSecretValid}>
                    Deploy
                </Button>
            </InputGroup>
        </div>
    </div>

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
        {info}
        <div className={"yourSocialRecoveryContent deploy"}>
            {deploying ? deployInProgressButton : deployContent}
        </div>

    </div>
}