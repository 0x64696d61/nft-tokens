// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract MyTokenERC1155 is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public tokenIds;

    constructor() ERC1155("ipfs://QmUiMGzVvv9K7qXpMfhbQQXycyhS1jFPwZMHKD1jjavfbF") {
        mint(msg.sender, 5 ** 18);
        mint(msg.sender, 10 ** 18);
    }

    function mint(address owner, uint amount) public onlyOwner() returns (uint256)
    {
        uint256 newGroupId = getNewId();
        _mint(owner, newGroupId, amount, "");

        return newGroupId;
    }

    function getNewId() private returns (uint256)
    {
        tokenIds.increment();
        uint256 tokenId = tokenIds.current();
        return tokenId;
    }

}
