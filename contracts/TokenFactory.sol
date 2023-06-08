//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Token.sol";

contract TokenFactory is Ownable {
    address[] public createdTokens;

    // Administrator of TokenFactory creates token
    // then transfer contract tokens and ownership to customer
    function createToken(
        uint256 _supply,
        address _customer,
        string calldata _tokenName,
        string calldata _tokenSymbol
    ) public onlyOwner {
        bytes memory tempTokenName = bytes(_tokenName);
        bytes memory tempTokenSymbol = bytes(_tokenSymbol);

        require(tempTokenName.length > 0, "Token name cannot be empty");
        require(tempTokenSymbol.length > 0, "Token symbol cannot be empty");
        require(_supply > 0, "Invalid total supply");

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
