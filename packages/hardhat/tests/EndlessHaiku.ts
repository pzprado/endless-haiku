import { ethers } from "hardhat";
import { expect } from "chai";
import { EndlessHaiku } from "../typechain-types";

describe("EndlessHaiku", function () {
  let testContract: EndlessHaiku;

  beforeEach(async function () {
    const EndlessHaikuFactory = await ethers.getContractFactory("EndlessHaiku");
    testContract = await EndlessHaikuFactory.deploy();
    await testContract.deployed();
  });

  describe("mintNFT", function () {
    it("should mint an NFT for a valid input", async function () {
      const word = "hello";
      const tx = await testContract.mintNFT(word);
      const receipt = await tx.wait();

      // Check that the NFT was minted successfully
      expect(receipt.status).to.equal(1);
      //   expect(await testContract.balanceOf(await ethers.provider.getSigner(0).getAddress())).to.equal(1);

      // Check that the token URI was set correctly
      //  expect(await testContract.tokenURI(1)).to.equal(word);
    });

    it("should mint an NFT for a lowercase word", async function () {
      await testContract.mintNFT("hello");
      const tokenURI = await testContract.tokenURI(1);
      expect(tokenURI).to.equal("hello");
      console.log(tokenURI);
    });

    // it("should convert input word to lowercase and mint an NFT", async function () {
    //   await testContract.mintNFT("HeLLo");
    //   const tokenURI = await testContract.tokenURI(1);
    //   expect(tokenURI).to.equal("hello");
    // });

    it("should revert for an invalid input", async function () {
      await expect(testContract.mintNFT("123")).to.be.revertedWith("Input must be a string with letters only");
    });

    it("should not mint an NFT for a word with special characters", async function () {
      await expect(testContract.mintNFT("hello!")).to.be.revertedWith("Input must be a string with letters only");
    });
  });
});
