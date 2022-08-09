const {expect} = require("chai");
const {ethers} = require("hardhat");
const {keccak256} = require("@ethersproject/keccak256");
const {toUtf8Bytes} = require("@ethersproject/strings");

describe("Social Recovery", function () {

    const secret1 = "123"
    const secretHash1 = keccak256(toUtf8Bytes(secret1));

    const deployContract = async (account) => {
        const SocialRecovery = await ethers.getContractFactory("SocialRecovery");
        return await SocialRecovery.deploy(account.address, secretHash1);
    }

    it("should deploy contract", async () => {
        const [owner] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)

        expect(await socialRecovery.account()).to.equal(owner.address)
        expect(await socialRecovery.getSecretHash()).to.equal(secretHash1)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(1)
    });

    it("should set and return secret hash contract", async () => {
        const [owner] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)
        const secret2 = "abc"
        const secretHash2 = keccak256(toUtf8Bytes(secret2));

        await socialRecovery.setSecret(secretHash2)

        expect(await socialRecovery.getSecretHash()).to.equal(secretHash2)
    });

    it("should add one guardian with threshold update", async () => {
        const [owner, address1] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)

        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(1)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(1)
    });

    it("should add two guardians with threshold update", async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)

        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address2.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(2)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(1)
    });

    it("should add three guardians with threshold update", async () => {
        const [owner, address1, address2, address3] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)

        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address2.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address3.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(3)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(2)
    });

    it("should add four guardians with threshold update", async () => {
        const [owner, address1, address2, address3, address4] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)

        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address2.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address3.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address4.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(4)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(2)
    });

    it("should add five guardians with threshold update", async () => {
        const [owner, address1, address2, address3, address4, address5] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)

        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address2.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address3.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address4.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address5.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(5)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(3)
    });

    it("should remove guardian from five guardians with threshold update", async () => {
        const [owner, address1, address2, address3, address4, address5] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)
        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address2.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address3.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address4.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address5.address)

        await socialRecovery.removeGuardianWithThresholdUpdate(address5.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(4)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(2)
    });

    it("should remove guardian from four guardians with threshold update", async () => {
        const [owner, address1, address2, address3, address4] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)
        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address2.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address3.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address4.address)

        await socialRecovery.removeGuardianWithThresholdUpdate(address4.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(3)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(2)
    });

    it("should remove guardian from three guardians with threshold update", async () => {
        const [owner, address1, address2, address3] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)
        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address2.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address3.address)

        await socialRecovery.removeGuardianWithThresholdUpdate(address3.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(2)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(1)
    });

    it("should remove guardian from two guardians with threshold update", async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)
        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)
        await socialRecovery.addGuardianWithThresholdUpdate(address2.address)

        await socialRecovery.removeGuardianWithThresholdUpdate(address2.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(1)
        expect(guardians[0]).to.equal(address1.address)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(1)
    });

    it("should remove guardian from one guardian with threshold update", async () => {
        const [owner, address1] = await ethers.getSigners();
        const socialRecovery = await deployContract(owner)
        await socialRecovery.addGuardianWithThresholdUpdate(address1.address)

        await socialRecovery.removeGuardianWithThresholdUpdate(address1.address)

        const guardians = await socialRecovery.getGuardians()
        expect(guardians.length).to.equal(0)
        expect(await socialRecovery.getGuardiansThreshold()).to.equal(1)
    });

})