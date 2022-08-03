import Header from "./Header";
import BackButton from "./BackButton";
import './YouAsAGuardian.css'
import {Accordion} from "react-bootstrap";
import YouAsAGuardianForAddress from "./YouAsAGuardianForAddress";
import {useEffect, useState} from "react";
import axios from "axios";

export default function YouAsAGuardian({address}) {

    const [recoveryAccounts, setRecoveryAccounts] = useState()

    const updateRecoveryAccounts = () => {
        console.log("Updating recovery accounts")
        const url = `https://f039pk1upb.execute-api.eu-central-1.amazonaws.com/api/getaddressesforguardian?address=${address}`
        axios.get(url)
            .then((response) => {
                const results = response.data.result
                console.log("Your guarded accounts")
                console.log(results)
                const resultsWithIndex = results.map((result, index) => {
                    return {index: index, recoveryContractAddress: result.recoveryContractAddress, accountAddress: result.accountAddress}
                })
                setRecoveryAccounts(resultsWithIndex)
            }).catch(e => {
            console.log("Error");
            console.error(e);
            if (e.response.status === 404) {
                console.log("You dont have any guarded account")
                setRecoveryAccounts([])
            } else {
                throw e
            }
        })
    }

    useEffect(() => {
        if(address) {
            updateRecoveryAccounts()
        }
    }, [address])

    const guardedAccounts = () => <div className={"youAsAGuardianContent youAsAGuardianDetails"}>
        <h4 className={"youAsAGuardianHeader"}>You are a guardian for following accounts</h4>
        <div className={"youAsAGuardianList"}>
            <Accordion defaultActiveKey={[0]} alwaysOpen flush>
                {recoveryAccounts.map(recoveryAccount => <YouAsAGuardianForAddress recoveryAccount={recoveryAccount}/>)}
            </Accordion>
        </div>
    </div>

    const loading = <div className={"connect-wallet"}>
        Connect your wallet
    </div>

    const notAGuardian = <div className={"connect-wallet"}>
        You are not a guardian for any account
    </div>

    const content = recoveryAccounts ? recoveryAccounts.length > 0 ? guardedAccounts() : notAGuardian : loading

    return <div className={"YouAsAGuardian"}>
        <Header/>
        <BackButton color={"left-color"}/>
        {recoveryAccounts ? content : loading}

    </div>
}