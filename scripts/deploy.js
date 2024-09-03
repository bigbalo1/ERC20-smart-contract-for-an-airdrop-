async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Token = await ethers.getContractFactory("ERC20Token"); // Replace with your ERC20 contract
    const token = await Token.deploy("TokenName", "TOKEN", ethers.utils.parseUnits("1000000", 18));
    await token.deployed();
  
    console.log("Token deployed to:", token.address);
  
    const MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
    const merkleRoot = "0xYourMerkleRootHere"; // Replace with your actual Merkle root
    const airdrop = await MerkleAirdrop.deploy(token.address, merkleRoot);
    await airdrop.deployed();
  
    console.log("MerkleAirdrop deployed to:", airdrop.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  