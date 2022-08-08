'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('change guardian to address', function () {
    it('should change guardian', async () => {
        const event = {
            "body": '{"address": "0x70EbbE40C41295bC757B50dE4325cb53a172F490"}'
        }
        let context;

        const result = await app.handler(event, context)

        expect(result.statusCode).to.equal(200);
    });

    it('should fail when address not found', async () => {
        const event = {
            "body": '{"address": "123"}'
        }
        let context;

        const result = await app.handler(event, context)

        expect(result.statusCode).to.equal(404);

    });
});
