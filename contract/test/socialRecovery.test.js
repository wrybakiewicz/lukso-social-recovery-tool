const {expect} = require("chai");
const {ethers} = require("hardhat");
const {keccak256} = require("@ethersproject/keccak256");
const {toUtf8Bytes} = require("@ethersproject/strings");

describe("Social Recovery", function () {

    it("should deploy contract", async function () {
        const [owner] = await ethers.getSigners();
        const secret1 = "123"
        const secretHash1 = keccak256(toUtf8Bytes(secret1));
        const SocialRecovery = await ethers.getContractFactory("SocialRecovery");
        const socialRecovery = await SocialRecovery.deploy(owner.address, secretHash1);

        expect(await socialRecovery.account()).to.equal(owner.address)
        expect(await socialRecovery.getSecretHash()).to.equal(secretHash1)
    });

    it("should set and return secret hash contract", async function () {
        const [owner] = await ethers.getSigners();
        const secret1 = "123"
        const secretHash1 = keccak256(toUtf8Bytes(secret1));
        const SocialRecovery = await ethers.getContractFactory("SocialRecovery");
        const socialRecovery = await SocialRecovery.deploy(owner.address, secretHash1);
        const secret2 = "abc"
        const secretHash2 = keccak256(toUtf8Bytes(secret2));

        await socialRecovery.setSecret(secretHash2)

        expect(await socialRecovery.getSecretHash()).to.equal(secretHash2)
    });

})