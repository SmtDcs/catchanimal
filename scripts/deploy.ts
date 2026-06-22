import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const CatNFT = await ethers.getContractFactory("CatNFT");
  const catNFT = await CatNFT.deploy();
  await catNFT.waitForDeployment();

  const address = await catNFT.getAddress();
  console.log("CatNFT deployed to:", address);

  // Test mint one for the deployer
  const tx = await catNFT.mintPet(
    deployer.address,
    "cat",
    "Tabby",
    2,
    "Sir Meowington III",
    "ipfs://test"
  );
  await tx.wait();
  console.log("Test mint successful");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
