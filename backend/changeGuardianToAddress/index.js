require("dotenv").config()
const { Pool } = require('pg')
const {ethers, ContractFactory} = require("ethers");
const SocialRecovery = require("./contracts/SocialRecovery.json");

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

const updateGuardians = async (address, contractAddress, currentGuardians) => {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.l16.lukso.network");
    const contract = ContractFactory.getContract(contractAddress, SocialRecovery.abi, provider)
    const guardiansFromContract = (await contract.getGuardians()).map(guardian => guardian.toLowerCase())
    const newGuardians = guardiansFromContract.filter(guardianFromContract => !currentGuardians.includes(guardianFromContract))
    const removedGuardians = currentGuardians.filter(currentGuardian => !guardiansFromContract.includes(currentGuardian))
    console.log("New guardians")
    console.log(newGuardians)
    console.log("Removed guardians")
    console.log(removedGuardians)
    if(newGuardians.length === 0 && removedGuardians.length === 0) {
        const message = "No new/removed guardians - retrying"
        console.log(message)
        throw Error(message)
    }
    const newGuardianPromises = newGuardians.map(guardian => addNewGuardian(address, guardian))
    const removeGuardianPromises = removedGuardians.map(guardian => removeGuardian(address, guardian))
    await Promise.all(newGuardianPromises)
    await Promise.all(removeGuardianPromises)
}

const addNewGuardian = async (address, guardianAddress) => {
    await query("INSERT INTO guardians_addresses(guardian_address, recovery_address) VALUES($1, $2)", [guardianAddress, address])
}

const removeGuardian = async (address, guardianAddress) => {
    await query("DELETE FROM guardians_addresses WHERE guardian_address = $1 AND recovery_address = $2", [guardianAddress, address])
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

const retryOperation = (operation, arg1, arg2, arg3, delay, retries) => new Promise((resolve, reject) => {
    return operation(arg1, arg2, arg3)
        .then(resolve)
        .catch((reason) => {
            if (retries > 0) {
                console.log("Retrying")
                console.log(reason)
                return wait(delay)
                    .then(retryOperation.bind(null, operation, arg1, arg2, arg3, delay, retries - 1))
                    .then(resolve)
                    .catch(reject);
            }
            return reject(reason);
        });
});

exports.handler = async (event, context) => {
    try {
        console.log("Changing guardian")
        console.log(event)
        const body = JSON.parse(event.body)
        const address = body.address.toLowerCase()
        console.log("Address: " + address)

        const contractAddressRows = await query("SELECT recovery_contract_address FROM recovery_contract_addresses WHERE address=$1", [address])

        if (contractAddressRows.rows.length === 0) {
            console.log("Address " + address + " has no contract deployed")
            return buildResponse(404, {})
        }

        const contractAddress = contractAddressRows.rows[0].recovery_contract_address

        console.log("Found contract address: " + contractAddress + " for: " + address)

        const currentGuardiansRows = await query("SELECT guardian_address FROM guardians_addresses WHERE recovery_address=$1", [address])

        const guardianAddresses = currentGuardiansRows.rows.map(currentGuardiansRow => currentGuardiansRow.guardian_address)

        console.log("Found current guardians for address: " + address)
        console.log(guardianAddresses)

        try {
            await retryOperation(updateGuardians, address, contractAddress, guardianAddresses, 3000, 5)
            return buildResponse(200, {})
        } catch (e) {
            console.error("Could not update guardians")
            return buildResponse(400, {})
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};
