import { ethers, deployments } from "hardhat";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WavePortal } from "../typechain-types";

chai.use(chaiAsPromised);

describe("WavePortal", () => {
	let deployer: SignerWithAddress, alice: SignerWithAddress;
	let contract: WavePortal;
	beforeEach(async () => {
		[deployer, alice] = await ethers.getSigners();
		await deployments.fixture(["_WavePortal"]);
		contract = await ethers.getContract("WavePortal");
	});

	it("Should wave", async () => {
		const initwaves = await contract.getAllWaves();
		expect(initwaves.length).to.be.equal(0);
		await contract.wave("I'm a potato");
		const newwaves = await contract.getAllWaves();
		expect(newwaves.length).to.be.equal(1);
	});

	it("Should allow user to wave", async () => {
		const initwaves = await contract.getAllWaves();
		expect(initwaves.length).to.be.equal(0);
		await contract.connect(alice).wave("I'm a potato");
		const newwaves = await contract.getAllWaves();
		expect(newwaves.length).to.be.equal(1);
	});

	it("Should show message", async () => {
		await contract.connect(alice).wave("I'm a potato");
		const newwaves = await contract.getAllWaves();
		expect(newwaves[0].message).to.be.equal("I'm a potato");
	});
});
