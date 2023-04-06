import { ethers } from "hardhat";
import { expect } from "chai";
import { EndlessHaiku__factory, EndlessHaiku } from "../typechain-types";

describe("EndlessHaiku", function () {
  let endlessHaiku: EndlessHaiku;

  beforeEach(async function () {
    const EndlessHaikuFactory = (await ethers.getContractFactory("EndlessHaiku")) as EndlessHaiku__factory;
    endlessHaiku = await EndlessHaikuFactory.deploy();
    await endlessHaiku.deployed();
  });

  describe("mintNFT", function () {
    it("should mint an NFT for a valid input", async function () {
      const word = "hello";
      const tx = await endlessHaiku.mintNFT(word);
      const receipt = await tx.wait();

      // Check that the NFT was minted successfully
      expect(receipt.status).to.equal(1);
      expect(await endlessHaiku.balanceOf(await ethers.provider.getSigner(0).getAddress())).to.equal(1);

      // Check that the token URI was set correctly
      expect(await endlessHaiku.tokenURI(1)).to.equal(word);
    });

    it("should mint an NFT for a lowercase word", async function () {
      await endlessHaiku.mintNFT("hello");
      const tokenURI = await endlessHaiku.tokenURI(1);
      expect(tokenURI).to.equal("hello");
    });

    it("should convert input word to lowercase and mint an NFT", async function () {
      await endlessHaiku.mintNFT("HeLLo");
      const tokenURI = await endlessHaiku.tokenURI(1);
      expect(tokenURI).to.equal("hello");
    });

    it("should revert for an invalid input", async function () {
      await expect(endlessHaiku.mintNFT("123")).to.be.revertedWith("Input must be a string with letters only");
    });

    it("should not mint an NFT for a word with special characters", async function () {
      await expect(endlessHaiku.mintNFT("hello!")).to.be.revertedWith("Input must be a string with letters only");
    });
  });
});
