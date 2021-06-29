// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract VoucherContract is ERC1155Burnable {
    uint256 public constant PRIZE_ID = 0;

    constructor() ERC1155("https://aavegotchi.com/metadata/vouchers/") {
        _mint(msg.sender, PRIZE_ID, 10**18, ""); // TODO: Should be updated
    }
}