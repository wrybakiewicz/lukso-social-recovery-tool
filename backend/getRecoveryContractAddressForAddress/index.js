require("dotenv").config()
const { Pool } = require('pg')

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


exports.handler = async (event, context) => {
    try {
        console.log("Getting recovery contract address for address")
        console.log(event)
        const queryParams = event.queryStringParameters
        const address = queryParams.address.toLowerCase()
        console.log("Address: " + address)

        const { rows } = await query("SELECT recovery_contract_address FROM recovery_contract_addresses WHERE address=$1", [address])
        if (rows.length === 0) {
            console.log("Deployment address not found")
            return buildResponse(404, {})
        }
        return buildResponse(200, {deploymentAddress: rows[0].recovery_contract_address})
    } catch (err) {
        console.log(err);
        throw err;
    }
};
