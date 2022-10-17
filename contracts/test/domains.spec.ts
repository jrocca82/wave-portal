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
		const initwaves = await contract.getTotalWaves();
		expect(initwaves).to.be.equal(0);
		await contract.wave();
		const newwaves = await contract.getTotalWaves();
		expect(newwaves).to.be.equal(1);
	});

  it("Should allow user to wave", async () => {
		const initwaves = await contract.getTotalWaves();
		expect(initwaves).to.be.equal(0);
		await contract.connect(alice).wave();
		const newwaves = await contract.getTotalWaves();
		expect(newwaves).to.be.equal(1);
	});
});
