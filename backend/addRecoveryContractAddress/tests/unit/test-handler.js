'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('add recovery contract address', function () {
    it('should add recovery contract address', async () => {
        const event = {
            "body": '{"txHash": "0x8892ca940bef07a3405c91c4766551331eb42b5eadffe0969cbc7593aa142b78"}'
        }
        let context;

        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(201);
    });

    it('should not add recovery contract address when one already exists', async () => {
        const event = {
            "body": '{"txHash": "0xf6f427b05af0df42b042bba58c0e35a274b24f1c75780bcf7ce8566ace6a9800"}'
        }
        let context;

        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(400);
    });

    it('should fail when hash is wrong', async () => {
        const event = {
            "body": '{"txHash": "123"}'
        }
        let context;

        const resultPromise = app.handler(event, context)

        return expect(resultPromise).to.be.rejected;
    });
});
