'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;


describe('get recovery contract address for address', function () {
    it('should return contract address when exists', async () => {
        const event = {
            queryStringParameters: {
                address: '0x70EbbE40C41295bC757B50dE4325cb53a172F490'
            }
        }
        let context;

        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        const response = JSON.parse(result.body);
        expect(response.deploymentAddress).to.equal('0xccc157d4e89d1d6fffcfbb7f83adcb95f0d2e3fe');
    });

    it('should not return contract address when does not exists', async () => {
        const event = {
            queryStringParameters: {
                address: '0x6324BfD13445FA2ea317d53716C4945d0a0Bd3ba'
            }
        }
        let context;

        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(404);
    });
});
