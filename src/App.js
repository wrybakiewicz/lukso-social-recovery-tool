import { ethers } from 'ethers';
import {useEffect} from "react";
import { ContractFactory } from 'ethers';
import LSP11BasicSocialRecoveryInit from "@lukso/lsp-smart-contracts/artifacts/contracts/LSP11BasicSocialRecovery/LSP11BasicSocialRecoveryInit.sol/LSP11BasicSocialRecoveryInit.json";


export default function App() {

  const initialize = async () => {
    console.log("Initializing")
    const etherProvider = new ethers.providers.Web3Provider(window.ethereum);

    const accountsRequest = await etherProvider.send(
        'eth_requestAccounts',
        [],
    );
    const signer = etherProvider.getSigner();
    const address = await signer.getAddress();
    console.log(address)

    const contractFactory = ContractFactory.fromSolidity(LSP11BasicSocialRecoveryInit, signer)

    const contract = await contractFactory.deploy()

    console.log(contract)

    console.log("Initialized")
  }

  useEffect(() => {
    initialize()
  }, [])

  return <div>
    <button>Deploy</button>
  </div>
}
