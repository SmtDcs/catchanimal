// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CatNFT is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    struct PetData {
        string species;      // "cat" or "dog"
        string breed;
        uint8 rarity;        // 0-4
        string name;         // funny name
        string photoCID;     // ipfs://...
        uint64 catchTime;
    }

    mapping(uint256 => PetData) public pets;

    constructor() ERC721("CatchCat Pet", "CATCHPET") Ownable(msg.sender) {}

    function mintPet(
        address to,
        string memory species,
        string memory breed,
        uint8 rarity,
        string memory name,
        string memory photoCID
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);

        pets[tokenId] = PetData({
            species: species,
            breed: breed,
            rarity: rarity,
            name: name,
            photoCID: photoCID,
            catchTime: uint64(block.timestamp)
        });

        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // For Aşama 1 we return a simple placeholder.
        // Later we will point to real IPFS JSON.
        return string(abi.encodePacked("ipfs://placeholder/", tokenId));
    }
}
