'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;


describe('add recovery contract address', function () {
    it('should add recovery contract address', async () => {
        const event = {
            "body": '{"txHash": "0x50977eacc421d5f7b27b5dfc39854ffb8c12286ba49fb2e959b345b3c8f302fa"}'
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
});
