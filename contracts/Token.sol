//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    address public administratorWallet;
    uint256 public fee = 500;
    uint256 public divisor = 10000;

    constructor(
        address _administratorWallet,
        address _contractOwner,
        uint256 _initialSupply,
        string memory _tokenName,
        string memory _tokenSymbol
    ) ERC20(_tokenName, _tokenSymbol) {
        _mint(_contractOwner, _initialSupply * 10 ** decimals());

        administratorWallet = _administratorWallet;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(amount > 0, "Amount should be bigger than 0");

        uint256 fees = (amount * fee) / divisor;

        if (fees > 0) {
            super._transfer(from, administratorWallet, fees);
        }

        amount -= fees;

        super._transfer(from, to, amount);
    }
}
