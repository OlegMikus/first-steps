const ethers = require('ethers')
const fs = require('fs-extra')
require('dotenv').config()

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    // console.log(typeof(encryptedJson))
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PK_PASSWORD);
    // wallet = await wallet.connect(provider);
    const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8')
    const binary = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.bin',
        'utf8',
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log('Deploy in progress')

    const contract = await contractFactory.deploy()
    await contract.deploymentTransaction().wait(1)
    console.log(`Contract Address: ${await contract.getAddress()}`)
    const currentFavouriteNumber = await contract.retrieve()
    console.log(`Current Favourite Number ${currentFavouriteNumber.toString()}`)
    const transactionResponse = await contract.store(154)
    const transactionReceipt = await transactionResponse.wait(1)
    console.log('Number was update')

    const newFavouriteNumber = await contract.retrieve()
    console.log(`Current Favourite Number ${newFavouriteNumber.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
