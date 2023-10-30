const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { assertArgument } = require("ethers")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.parseEther("0.1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("allows people to fund", async function () {
              const transactionResponse = await fundMe.fund({
                  value: sendValue,
              })
              const transactionReceipt = await transactionResponse.wait(1)

              const endingBalance = await ethers.provider.getBalance(
                  fundMe.target
              )
              assert.equal(endingBalance, sendValue)
          })
          it("allows people to withdraw", async function () {
              const transactionResponse = await fundMe.cheaperWithdraw()
              const transactionReceipt = await transactionResponse.wait(1)

              const endingBalance = await ethers.provider.getBalance(
                  fundMe.target
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
