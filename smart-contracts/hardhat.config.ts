import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
};

export default config;
