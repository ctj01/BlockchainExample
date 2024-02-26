const hre = require("hardhat");

async function main() {

    const contract = await hre.ethers.getContractFactory("Example");
    const obj = await contract.deploy();
    console.log(
        `deployed to ${obj.target}`
    );

}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});

