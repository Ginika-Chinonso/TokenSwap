import { ethers } from "hardhat";

async function main() {
    const [addr1] = await ethers.getSigners();

    //Mainnet Token Addresses
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
    const ONEINCH = "0x111111111117dC0aa78b770fA6A738034120C302"
    const AAVE = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
    const ALCX = "0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF"
    const ENS = "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72"
    const LINK = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
    const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const RICHKID = "0x748dE14197922c4Ae258c7939C7739f3ff1db573"



    // Mainnet Aggregator addresses
    const ONEINCHETH = "0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8"
    const ONEINCHUSD = "0xc929ad75B72593967DE83E7F7Cda0493458261D9"
    const AAVEETH = "0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012"
    const AAVEUSD = "0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012"
    const ALCXETH = "0x194a9AaF2e0b67c35915cD01101585A33Fe25CAa"
    const ALCXUSD = "0xc355e4C0B3ff4Ed0B49EaACD55FE29B311f42976"
    const ENSUSD = "0x5C00128d4d1c2F4f652C267d7bcdD7aC99C16E16"
    const LINKUSD = "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c"
    const UNIUSD = "0x553303d460EE0afB37EdFf9bE42922D8FF63220e"
    const DAIUSD = "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9"
    const ETHUSD = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"

    const TOKENSWAP = await ethers.getContractFactory("TokenSwap");

    const tokenSwap = await TOKENSWAP.deploy();

    await tokenSwap.deployed();

    console.log(`Contract deployed at address: ${await tokenSwap.address}`)

    const DaiContract = await ethers.getContractAt("IToken", DAI)

    const UniContract = await ethers.getContractAt("IToken", UNI)



    const helpers = require("@nomicfoundation/hardhat-network-helpers");
    await helpers.impersonateAccount(RICHKID);
    const impersonatedSigner = await ethers.getSigner(RICHKID);
    

    const _amount = await ethers.utils.parseEther("500")
    const _amountToadd = await ethers.utils.parseEther("100")
    const _amountToRemove = await ethers.utils.parseEther("50")
    const _amountToSwap = await ethers.utils.parseEther("100")


    console.log(`Approving tokens`)
    await DaiContract.connect(impersonatedSigner).approve(tokenSwap.address, _amount)
    await UniContract.connect(impersonatedSigner).approve(tokenSwap.address, _amount)

    console.log(`Adding Liquidity`)
    await tokenSwap.connect(impersonatedSigner).addLiquidity(DAI, UNI, _amountToadd, _amountToadd)

    console.log(`Contract Balance after adding Liquidity`)
    console.log(`Contract DAI balance is: ${await DaiContract.balanceOf(tokenSwap.address)}`)
    console.log(`Contract UNI balance is: ${await UniContract.balanceOf(tokenSwap.address)}`)


    console.log(`Set aggregator address for tokens`)
    await tokenSwap.setAggAdd(USDT, DAI, DAIUSD)
    await tokenSwap.setAggAdd(USDT, UNI, UNIUSD)
    await tokenSwap.setAggAdd(USDT, ALCX, ALCXUSD)
    await tokenSwap.setAggAdd(USDT, WETH, ETHUSD)

    console.log(`Getting token prices`)
    const UniDaiPrice = await tokenSwap.getPriceFromToken(UNI, DAI)
    const ALCXDaiPrice = await tokenSwap.getPriceFromToken(ALCX, DAI)
    const ETHALCXPrice = await tokenSwap.getPriceFromToken(WETH, ALCX)
    const ETHUNIPrice = await tokenSwap.getPriceFromToken(WETH, UNI)

    console.log(`The price of UNI/DAI is ${UniDaiPrice}`)
    console.log(`The price of ALCX/DAI is ${ALCXDaiPrice}`)
    console.log(`The price of ETH/ALCX is ${ETHALCXPrice}`)
    console.log(`The price of ETH/UNI is ${ETHUNIPrice}`)


    console.log(`Token swap`)

    console.log(`Get price`)

    const AAVEUSDPrice = await tokenSwap.getPrice(AAVEUSD)

    console.log(`DAIUSD Price: ${AAVEUSDPrice}`)

    console.log(`DAI balance of Rich Kid before swap: ${await DaiContract.balanceOf(RICHKID)}`)
    console.log(`UNI balance of Rich Kid before swap: ${await UniContract.balanceOf(RICHKID)}`)

    console.log(`Swapping DAI for UNI`)
    const RelativeAmount = await tokenSwap.getRelativeAmt(DAI, UNI, _amountToSwap)
    console.log(`Relative amount  = ${await RelativeAmount}`)
    await tokenSwap.connect(impersonatedSigner).swap(DAI, UNI,_amountToSwap)
    

    console.log(`DAI balance of Rich Kid after swap: ${await DaiContract.balanceOf(RICHKID)}`)
    console.log(`UNI balance of Rich Kid after swap: ${await UniContract.balanceOf(RICHKID)}`)

    console.log(`Contract DAI balance after swap is: ${await DaiContract.balanceOf(tokenSwap.address)}`)
    console.log(`Contract UNI balance after swap is: ${await UniContract.balanceOf(tokenSwap.address)}`)


    console.log(`Removing Liquidity`)

    await tokenSwap.connect(impersonatedSigner).removeLiquidity(DAI, UNI, _amountToRemove, _amountToRemove)

    console.log(`Contract DAI balance is: ${await DaiContract.balanceOf(tokenSwap.address)}`)
    console.log(`Contract UNI balance is: ${await UniContract.balanceOf(tokenSwap.address)}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});