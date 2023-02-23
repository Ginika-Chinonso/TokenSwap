import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        //@ts-ignore
        url: process.env.MAINNET
      }
    },
    goerli: {
      url: process.env.GOERLI_RPC,
      //@ts-ignore
      accounts: [process.env.ACC1_PRIVATE_KEY, process.env.ACC2_PRIVATE_KEY, process.env.ACC3_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
  
}


export default config;
