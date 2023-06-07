const TokenFactory = artifacts.require('TokenFactory');

module.exports = async function (deployer, networks, accounts) {
  await deployer.deploy(TokenFactory);

  const tokenFactory = await TokenFactory.deployed();
};
