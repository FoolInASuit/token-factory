// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./Token.sol";

contract TokenFactory is Ownable {
    address[] public createdTokens;

    // Administrator of TokenFactory creates token
    // then transfer contract tokens and ownership to customer
    function createToken(
        uint256 _supply,
        address _customer,
        string memory _tokenName,
        string memory _tokenSymbol
    ) public onlyOwner {
        Token token = new Token(
            owner(),
            _customer,
            _supply,
            _tokenName,
            _tokenSymbol
        );

        token.transferOwnership(_customer);

        createdTokens.push(address(token));
    }
}
