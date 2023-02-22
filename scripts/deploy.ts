import { ethers } from "hardhat";

async function main() {
    const [addr1] = await ethers.getSigners();

    //Mainnet
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
    const RICHKID = "0x748dE14197922c4Ae258c7939C7739f3ff1db573"
    // const RICHKID = "0x8155784AA96189356514D39dA5d8015e5Cd35D23";

    const TOKENSWAP = await ethers.getContractFactory("TokenSwap");

    const tokenSwap = await TOKENSWAP.deploy();

    await tokenSwap.deployed();

    console.log(`Contract deployed at address: ${await tokenSwap.address}`)


    const DaiContract = await ethers.getContractAt("IToken", DAI)

    const UniContract = await ethers.getContractAt("IToken", UNI)



    const helpers = require("@nomicfoundation/hardhat-network-helpers");
    await helpers.impersonateAccount(RICHKID);
    const impersonatedSigner = await ethers.getSigner(RICHKID);
    

    const _amount = await ethers.utils.parseEther("100")

    await DaiContract.connect(impersonatedSigner).approve(tokenSwap.address, _amount)
    await UniContract.connect(impersonatedSigner).approve(tokenSwap.address, _amount)

    const res = await tokenSwap.connect(impersonatedSigner).addLiquidity(DAI, UNI, _amount, _amount)

    console.log(`Contract DAI balance is: ${await DaiContract.balanceOf(tokenSwap.address)}`)
    console.log(`Contract DAI balance is: ${await UniContract.balanceOf(tokenSwap.address)}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});