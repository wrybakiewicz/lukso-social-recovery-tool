'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;


describe('get addresses for guardian', function () {
    it('should return addresses when guardian is connected to two contracts', async () => {
        const event = {
            queryStringParameters: {
                address: '0xBF58002fb2C2821Fdc801ee9192366bbE5C63a9f'
            }
        }
        let context;

        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        const response = JSON.parse(result.body);
        expect(response.result[0].accountAddress).to.equal('0x70ebbe40c41295bc757b50de4325cb53a172f490');
        expect(response.result[0].recoveryContractAddress).to.equal('0xecddde3c2d82529b2836f4728031e2fb5514683e');
        expect(response.result[1].accountAddress).to.equal('0xa0cf024d03d05303569be9530422342e1ceaf481');
        expect(response.result[1].recoveryContractAddress).to.equal('0xa0cf024d03d05303569be9530422342e1ceaf480');
    });

    it('should return addresses when guardian is connected to one contract', async () => {
        const event = {
            queryStringParameters: {
                address: '0x6840fa82917845f6eea181a833f80098e3bba7d3'
            }
        }
        let context;

        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        const response = JSON.parse(result.body);
        expect(response.result[0].accountAddress).to.equal('0x70ebbe40c41295bc757b50de4325cb53a172f490');
        expect(response.result[0].recoveryContractAddress).to.equal('0xecddde3c2d82529b2836f4728031e2fb5514683e');
    });

    it('should not return addresses when user is not a guardian anywhere', async () => {
        const event = {
            queryStringParameters: {
                address: 'abc'
            }
        }
        let context;

        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(404);
    });
});
