const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MerkleAirdrop", function () {
  let merkleAirdrop;
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the ERC20Mock contract
    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("Sample Token", "STK", ethers.parseEther("10000")); // Updated for ethers@6.x
   // Verify deployment
    console.log(`Token deployed to: ${token.address}`);
    await token.deployed();

    // Deploy the MerkleAirdrop contract with the generated Merkle root
    const MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
    merkleAirdrop = await MerkleAirdrop.deploy(
      token.address,
      "0xa9727cde3e05f08980aea1395bdfec25a3079eb12aec77e5ed363887f2c9d0f3" // Replace with actual Merkle root
    );
    await merkleAirdrop.deployed();

    // Transfer some tokens to the airdrop contract
    await token.transfer(merkleAirdrop.address, ethers.parseEther("1000")); // Updated for ethers@6.x
  });

  it("Should allow a valid claim", async function () {
    // Replace this with the actual Merkle proof generated for addr1
    const merkleProof = [
      '0x0ecb6edd858b7aeca978b9af1bc00817bf88176a965638a881e036e85c95519a',
      '0x760db02ffb005d21f22ca083f96383e5711234948de002dcb9e876f4c49d1719'
    ];

    const claimAmount = ethers.parseEther("100"); // Updated for ethers@6.x

    await expect(
      merkleAirdrop.connect(addr1).claim(claimAmount, merkleProof)
    ).to.emit(merkleAirdrop, "Claimed")
     .withArgs(addr1.address, claimAmount);

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(claimAmount);
  });
});
