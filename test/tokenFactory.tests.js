const TokenFactory = artifacts.require('TokenFactory');
const Token = artifacts.require('Token');

const { expectRevert } = require('@openzeppelin/test-helpers');

contract('TokenFactory', ([administrator, customer, tokenReciver]) => {
  let tokenFactoryInstance;

  const tokensInWei = (amount) => web3.utils.toWei(amount.toString(), 'ether');

  before(async () => {
    tokenFactoryInstance = await TokenFactory.deployed();
  });

  describe('Creating token', async () => {
    it('should create token', async () => {
      const name = 'Token X';
      const symbol = 'TX';

      await tokenFactoryInstance.createToken(1000, customer, name, symbol, {
        from: administrator,
      });

      const deloyedContract = await tokenFactoryInstance.createdTokens.call(0);

      let tokenInstance = await Token.at(deloyedContract);

      const clientBalance = await tokenInstance.balanceOf(customer);
      const contractOwner = await tokenInstance.owner();
      const contractName = await tokenInstance.name();
      const contractSymbol = await tokenInstance.symbol();

      assert.equal(contractName, name);
      assert.equal(contractSymbol, symbol);
      assert.equal(clientBalance, tokensInWei(1000));
      assert.equal(contractOwner, customer);
    });

    it('should not allow empty token name', async () => {
      const name = '';
      const symbol = 'x';

      await expectRevert(
        tokenFactoryInstance.createToken(1000, customer, name, symbol, {
          from: administrator,
        }),
        'Token name cannot be empty'
      );
    });

    it('should not allow empty token symbol', async () => {
      const name = 'Token X';
      const symbol = '';

      await expectRevert(
        tokenFactoryInstance.createToken(0, customer, name, symbol, {
          from: administrator,
        }),
        'Token symbol cannot be empty'
      );
    });

    it('should not allow 0 supply', async () => {
      const name = 'Token X';
      const symbol = 'TX';

      await expectRevert(
        tokenFactoryInstance.createToken(0, customer, name, symbol, {
          from: administrator,
        }),
        'Invalid total supply'
      );
    });
  });

  describe('Transfering Tokens', async () => {
    it('should transfer token to recipient and take fee for administrator', async () => {
      const name = 'Token X';
      const symbol = 'TX';

      await tokenFactoryInstance.createToken(1000, customer, name, symbol, {
        from: administrator,
      });

      const deloyedContract = await tokenFactoryInstance.createdTokens.call(0);

      let tokenInstance = await Token.at(deloyedContract);

      await tokenInstance.transfer(tokenReciver, tokensInWei(100), {
        from: customer,
      });

      const tokenReciverBalance = await tokenInstance.balanceOf(tokenReciver);
      const administratorBalance = await tokenInstance.balanceOf(administrator);

      assert.equal(tokenReciverBalance, tokensInWei(95));
      assert.equal(administratorBalance, tokensInWei(5));
    });

    it('should not allow transfers with amount equal 0', async () => {
      const name = 'Token X';
      const symbol = 'TX';

      await tokenFactoryInstance.createToken(1000, customer, name, symbol, {
        from: administrator,
      });

      const deloyedContract = await tokenFactoryInstance.createdTokens.call(0);

      let tokenInstance = await Token.at(deloyedContract);

      await expectRevert(
        tokenInstance.transfer(tokenReciver, 0, {
          from: customer,
        }),
        'Amount should be bigger than 0'
      );
    });
  });
});
