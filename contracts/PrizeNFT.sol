// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./VoucherContract.sol";

struct RafflePrize {
    address prizeAddress; // ERC1155 token contract
    uint256 prizeQuantity; // Number of ERC1155 tokens
    uint256 prizeId; // ERC1155 token type
}

contract PrizeNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    VoucherContract vc;
    mapping(uint256 => RafflePrize) prizes;
    string baseURI = "https://aavegotchi.com/metadata/vouchers/"; // TODO: Should be updated

    constructor() ERC721("PrizeNFT", "PNT") {}

    function setVoucher(address _who) public {
        vc = VoucherContract(_who);
    }

    function awardPrize(address _who, uint256 _prizeQuantity, uint256 _prizeId) public returns (uint256) {
        require(
            _who == msg.sender || isApprovedForAll(_who, msg.sender),
            "ERC721: caller is not owner nor approved"
        );

        uint256 _prizeNFTId = _tokenIds.current();

        prizes[_prizeNFTId].prizeAddress = _who;
        prizes[_prizeNFTId].prizeQuantity = _prizeQuantity;
        prizes[_prizeNFTId].prizeId = _prizeId;

        _safeMint(_who, _prizeNFTId);
        _setTokenURI(_prizeNFTId, baseURI);

        vc.burn(_who, _prizeId, _prizeQuantity);

        _tokenIds.increment();
        return _prizeNFTId;
    }
}
