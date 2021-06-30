const {expect} = require('chai')

const {deploy} = require('../scripts/deploy.js')

describe('Deploying Contracts', async function () {
  before(async function () {
    const deployVars = await deploy()
    global.voucherContract = deployVars.voucherContract
    global.prizeNFT = deployVars.prizeNFT
    global.account = deployVars.accounts[0]
    global.anotherAccount = deployVars.accounts[1]
    global.prizeId = 0
  })
  it('Voucher Contract should mint 1 ERC1155 prize', async function () {
    const balance = await global.voucherContract.balanceOf(global.account.address, global.prizeId)
    expect(balance).to.equal(ethers.utils.parseEther('1'))
  })
  it('PrizeNFT Contract should be approved for all', async function () {
    const isApproved = await global.voucherContract.isApprovedForAll(account.address, global.prizeNFT.address)
    expect(isApproved).to.equal(true)
  })
})

describe('Award Prize', async function () {
  it('Should fail if sender is not the owner and not approved', async function () {
    await expect(prizeNFT.connect(anotherAccount).awardPrize(account.address, 1, prizeId)).to.be.revertedWith('ERC721: caller is not owner nor approved')
  })
  it('Should fail if account has not enough balance', async function () {
    const balance = await voucherContract.balanceOf(account.address, prizeId)
    await expect(prizeNFT.awardPrize(account.address, balance + 1, prizeId)).to.be.revertedWith('ERC721: Not enough balance')
  })
  it('Should succeed if account has enough balance', async function () {
    let balance = await voucherContract.balanceOf(account.address, prizeId)
    await prizeNFT.awardPrize(account.address, balance, prizeId)
    balance = await voucherContract.balanceOf(account.address, prizeId)
    expect(balance).to.equal(ethers.utils.parseEther('0'))
  })
})


