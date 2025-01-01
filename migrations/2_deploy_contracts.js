const fs = require('fs');
const DappVotes = artifacts.require('DappVotes');

module.exports = async function (deployer) {
  try {
    await deployer.deploy(DappVotes);
    const contract = await DappVotes.deployed();

    const address = JSON.stringify({ address: contract.address }, null, 4);

    fs.writeFileSync('./build/contractAddress.json', address, 'utf8');
    console.log('Deployed contract address:', contract.address);
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
};