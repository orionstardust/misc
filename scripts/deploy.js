// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const {ethers} = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners()
  const owner = await accounts[0].getAddress()

  console.log('Deploying Voucher Contract.....')
  const voucherContract = await (await ethers.getContractFactory('VoucherContract')).deploy()
  await voucherContract.deployed()
  let tx = voucherContract.deployTransaction
  let result = await tx.wait()
  if (!result.status) {
    console.log('Deploying Voucher Contract TRANSACTION FAILED!!! ---------------')
    console.log('Transaction hash:' + tx.hash)
    throw (Error('failed to deploy Voucher Contract'))
  }
  console.log('Storage deploy transaction hash:' + tx.hash)
  console.log('Storage deployed to:', voucherContract.address)

  console.log('Deploying Prize NFT.....')
  const prizeNFT = await (await ethers.getContractFactory('PrizeNFT')).deploy()
  await prizeNFT.deployed()
  tx = prizeNFT.deployTransaction
  result = await tx.wait()
  if (!result.status) {
    console.log('Deploying Prize NFT TRANSACTION FAILED!!! ---------------')
    console.log('Transaction hash:' + tx.hash)
    throw (Error('failed to deploy Prize NFT'))
  }
  console.log('Certificate deploy transaction hash:' + tx.hash)
  console.log('Certificate deployed to:', prizeNFT.address)

  console.log('Configuring Voucher Contract in Prize NFT.....')
  tx = await prizeNFT.setVoucher(voucherContract.address)
  result = await tx.wait()
  if (!result.status) {
    throw Error(`Error:: ${tx.hash}`)
  }
  console.log('Voucher Contract configured in Prize NFT: transaction hash:' + tx.hash)

  console.log('Setting Prize NFT approved in Voucher Contract.....')
  tx = await voucherContract.setApprovalForAll(prizeNFT.address, true)
  result = await tx.wait()
  if (!result.status) {
    throw Error(`Error:: ${tx.hash}`)
  }
  console.log('Prize NFT set approved in Voucher Contract: transaction hash:' + tx.hash)

  return {
    accounts: accounts,
    voucherContract: voucherContract,
    prizeNFT: prizeNFT,
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

exports.deploy = main
