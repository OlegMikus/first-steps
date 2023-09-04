const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploy in progress")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.getDeployedCode()
    console.log(`Address ${ await simpleStorage.getAddress()}`)

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
        await simpleStorage.deploymentTransaction().wait(6)
        await verify(
            await simpleStorage.getAddress(),
            []
        )
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current Value: ${currentValue}`)
    const transactionResponse = await simpleStorage.store(21);
    await transactionResponse.wait(1);
    const newValue = await simpleStorage.retrieve();
    console.log(`New Value: ${newValue}`)

}


async function verify(contractAddress, args){
    console.log("Contract verification...")
    try{
        await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,

    })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")){
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })