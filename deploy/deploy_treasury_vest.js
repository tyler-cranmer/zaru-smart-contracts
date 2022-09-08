/* 
Deployment Script for Zaru Treasury Vesting Contract. 
September 7th 2022
*/

const { ethers } = require('hardhat');
let { networkConfig } = require('../helper-hardhat-config');
require('dotenv').config();

// Contract name
const contract_name = 'VestingZaru';

// Contract parameters
const ruTokenAddress = '';
const recipientAddress = '';
const vestingAmount = '';
const vestingCliffDuration = '';
const vestingDuration = '';

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  log('--------------------------------------');
  // deploys contract
  const Vest = await deploy(contract_name, {
    from: deployer,
    args: [
      ruTokenAddress,
      recipientAddress,
      vestingAmount,
      vestingCliffDuration,
      vestingDuration,
    ],
    log: true,
  });

  log(`You deployed ${contract_name} contract to address: ${Vest.address}`);

  const factory = await ethers.getContractFactory(contract_name);
  const accounts = await hre.ethers.getSigners();
  const signer = accounts[0];

  const VestingContract = new ethers.Contract(
    Vest.address,
    factory.interface,
    signer
  );

  const RuToken = await VestingContract.ruToken();
  const Recipient = await VestingContract.recipient();
  const VestingAmount = await VestingContract.vestingAmount();
  const VestingDuration = await VestingContract.vestingDuration();
  const VestingBegin = await VestingContract.vestingBegin();
  const VestingCliff = await VestingContract.vestingCliff();
  const VestingCliffDuration = VestingCliff.sub(VestingBegin);

  log(
    `\nContract Parameters:\nRu Token Address: ${RuToken} \nRecipient: ${Recipient} \nVesting Amount: ${VestingAmount}\nVesting Duration: ${VestingDuration}\nVestingCliff Duration: ${VestingCliffDuration}`
  );
    
    log(`\nVesting Start Date: ${VestingBegin}\nVesting Cliff`)
    const networkName = networkConfig[chainId]['name'];
    
    log(
      `\n Verify with: \n npx hardhat verify --network ${networkName} ${VestingContract.address} "${Vest.args[0]}" "${Vest.args[1]}" "${Vest.args[2]}" "${Vest.args[3]}" "${Vest.args[4]}"`
    );
};

module.exports.tags = ['vesting']
