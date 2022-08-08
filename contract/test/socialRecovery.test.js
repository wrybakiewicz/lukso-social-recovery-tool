const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Social Recovery", function () {

    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const SocialRecovery = await ethers.getContractFactory("SocialRecovery");
      const socialRecovery = await SocialRecovery.deploy(owner.address);

      expect(await socialRecovery.account()).to.equal(owner.address)
    });

})