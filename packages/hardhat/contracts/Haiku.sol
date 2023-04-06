// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract EndlessHaiku is ERC721 {
  uint256 private tokenIdCounter = 0;
  uint256 public constant PRICE_PER_TOKEN = 0.08 ether;

  constructor() ERC721("Endless Haiku", "HAIKU") {}

  function mintNFT(string memory word) public {
    require(_isLettersOnly(word), "Input must be a string with letters only");
    string memory lowerWord = _toLower(word);
    uint256 tokenId = ++tokenIdCounter;
    _safeMint(msg.sender, tokenId);
  }

  function _isLettersOnly(string memory word) private pure returns (bool) {
    bytes memory wordBytes = bytes(word);
    for (uint i = 0; i < wordBytes.length; i++) {
      bytes1 char = wordBytes[i];
      if (!(char >= bytes1("a") && char <= bytes1("z"))) {
        return false;
      }
    }
    return true;
  }

  function _toLower(string memory word) private pure returns (string memory) {
    bytes memory wordBytes = bytes(word);
    bytes memory lowerBytes = new bytes(wordBytes.length);
    for (uint i = 0; i < wordBytes.length; i++) {
      bytes1 char = wordBytes[i];
      if (char >= bytes1("A") && char <= bytes1("Z")) {
        lowerBytes[i] = bytes1(uint8(char) + 32);
      } else {
        lowerBytes[i] = char;
      }
    }
    return string(lowerBytes);
  }

 
}
