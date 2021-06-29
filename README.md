# Project for ERC1155 Voucher Contract 


## How to use Hardhat and smart contracts
### Install hardhat, and setup hardhat project
```
npm install -s hardhat @nomiclabs/hardhat-ethers 'ethers@^5.0.0'
```
```
npx hardhat
vi hardhat.config.js
```

### Edit main contract
```
vi ./contracts/*.sol
```

### Compile contract
```
npx hardhat compile
```

### Run hardhat node (or run Ganache) to deploy contract to test
```
npx hardhat node
```

### Create deploy script and deploy contract
```
vi ./scripts/deploy.js
npx hardhat run --network hardhat scripts/deploy.js
```
