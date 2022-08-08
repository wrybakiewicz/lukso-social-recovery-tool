const { expect } = require("chai");
const { ethers } = require("hardhat");
const {keccak256} = require("@ethersproject/keccak256");
const {toUtf8Bytes} = require("@ethersproject/strings");

describe("Social Recovery", function () {

    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const SocialRecovery = await ethers.getContractFactory("SocialRecovery");
      const socialRecovery = await SocialRecovery.deploy(owner.address);

      expect(await socialRecovery.account()).to.equal(owner.address)
    });

    it("should set and return secret hash contract", async function () {
        const [owner] = await ethers.getSigners();
        const SocialRecovery = await ethers.getContractFactory("SocialRecovery");
        const socialRecovery = await SocialRecovery.deploy(owner.address);
        const secret = "abc"
        const secretHash = keccak256(toUtf8Bytes(secret));

        await socialRecovery.setSecret(secretHash)

        expect(await socialRecovery.getSecretHash()).to.equal(secretHash)
    });

})