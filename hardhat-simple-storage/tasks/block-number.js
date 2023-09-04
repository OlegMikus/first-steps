const { task } = require("hardhat/config")
const {createModelsAndDecodeBytecodes} = require("hardhat/internal/hardhat-network/stack-traces/compiler-to-model");

task("block-number", "Prints the current block number").setAction(
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number: ${blockNumber}`)
    }
)

module.exports = {}