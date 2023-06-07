const HDWalletProvider = require('@truffle/hdwallet-provider');

const { INFURA_SEPOLIA_URL, MNEMONIC, ETHERSCAN_KEY } = process.env;

module.exports = {
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: ETHERSCAN_KEY,
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
    solc: {
      version: '^0.8.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    sepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_SEPOLIA_URL),
      network_id: 11155111,
      gas: 4465030,
    },
  },
};
