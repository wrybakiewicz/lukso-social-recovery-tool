require("dotenv").config()
const { Pool } = require('pg')
const {ethers} = require("ethers");

const OWNERSHIP_TRANSFERED_METHOD_ID = "0x8be0079c"
const CONTRACT_CREATED_METHOD_ID = "0x01c42bd7"

const dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME
};

const pool = new Pool(dbConfig)

let client;

async function query(query, value) {
    if(client === undefined) {
        await initializeDbClient()
    }
    try {
        return await client.query(query, value)
    } catch (e) {
        console.log("Error querying")
        throw e
    }
}

const initializeDbClient = async () => {
    try {
        client = await pool.connect()
    } catch (e) {
        console.log("Error initializing client")
        throw e
    }
}

const getContractAddress = (transactionLogs) => {
    const contractCreatedLog = transactionLogs.filter(log => log.topics[0].startsWith(CONTRACT_CREATED_METHOD_ID))[0]
    const contractAddressAsBytes = contractCreatedLog.topics[2]
    return "0x" + contractAddressAsBytes.slice(-40)
}

const getOwnerAddress = (transactionLogs) => {
    const ownershipTransferedLog = transactionLogs.filter(log => log.topics[0].startsWith(OWNERSHIP_TRANSFERED_METHOD_ID))[0]
    const ownerAddressAsBytes = ownershipTransferedLog.topics[2]
    return "0x" + ownerAddressAsBytes.slice(-40)
}

const getRecoveryContractAddressWithOwnerAddress = async (txHash) => {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.l16.lukso.network");
    const transaction = await provider.getTransactionReceipt(txHash)
    const contractAddress = getContractAddress(transaction.logs).toLowerCase()
    const ownerAddress = getOwnerAddress(transaction.logs).toLowerCase()
    return {contractAddress: contractAddress, ownerAddress: ownerAddress}
}

const buildResponse = (statusCode, bodyJson) => {
    return {
        "statusCode": statusCode,
        "headers": {
        "Content-Type" : "application/json",
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
    },
        "body": JSON.stringify(bodyJson),
    }
}

const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, arg, delay, retries) => new Promise((resolve, reject) => {
    return operation(arg)
        .then(resolve)
        .catch((reason) => {
            if (retries > 0) {
                console.log("Retrying")
                return wait(delay)
                    .then(retryOperation.bind(null, operation, arg, delay, retries - 1))
                    .then(resolve)
                    .catch(reject);
            }
            return reject(reason);
        });
});

exports.handler = async (event, context) => {
    try {
        console.log("Getting recovery contract address for address")
        console.log(event)
        const body = JSON.parse(event.body)
        const txHash = body.txHash
        console.log("TxHash: " + txHash)

        const {contractAddress, ownerAddress} = await retryOperation(getRecoveryContractAddressWithOwnerAddress, txHash, 1000, 20)

        console.log(contractAddress)
        console.log(ownerAddress)
        const { rows } = await query("SELECT recovery_contract_address FROM recovery_contract_addresses WHERE address=$1", [ownerAddress])
        if (rows.length > 0) {
            console.log("Contract address already exist")
            return buildResponse(400, {})
        }
        await query("INSERT INTO recovery_contract_addresses(address, recovery_contract_address) VALUES ($1, $2)", [ownerAddress, contractAddress])
        return buildResponse(201, {})
    } catch (err) {
        console.log(err);
        throw err;
    }
};
