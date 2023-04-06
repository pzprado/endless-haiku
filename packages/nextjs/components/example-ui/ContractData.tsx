import { useEffect, useRef, useState } from "react";
import EndlessHaikuNFT from "../../public/assets/EndlessHaiku.json";
import { getLocalProvider } from "../../utils/scaffold-eth";
import { ethers } from "ethers";
import Marquee from "react-fast-marquee";
import { localhost } from "wagmi/chains";
import {
  useAnimationConfig,
  useScaffoldContractRead,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const MARQUEE_PERIOD_IN_SEC = 5;

interface EndlessHaikuNFT {
  word: string;
  tokenId: number;
}

export const ContractData = () => {
  const [nfts, setNfts] = useState<EndlessHaikuNFT[]>([]);

  const { data: totalCounter } = useScaffoldContractRead({
    contractName: "EndlessHaiku",
    functionName: "tokenIdCounter",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const provider = await getLocalProvider(localhost);
        const contract = new ethers.Contract(
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          EndlessHaikuNFT.abi,
          provider,
        );
        const filter = contract.filters.Transfer(null, null);
        const events = await contract.queryFilter(filter);
        const nftsData = await Promise.all(
          events.map(async event => {
            const tokenId = event.args.tokenId.toString();
            const tokenURI = await contract.tokenURI(tokenId);
            return { tokenId, tokenURI };
          }),
        );

        setNfts(nftsData);
        console.log(nftsData);
        return;
      } catch (error) {
        console.log("Error fetching ", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      <div className="flex justify-end items-center px-4">
        <div className="bg-secondary border border-primary rounded-xl flex">
          <div className="p-2 py-1 border-r border-primary flex items-end">word count</div>
          <div className="text-4xl text-right min-w-[3rem] px-2 py-1 flex justify-end font-bai-jamjuree">
            {totalCounter?.toString() || "0"}
          </div>
        </div>
      </div>
      <div className="flex mt-8 justify-center items-center">
        {nfts.map(nft => (
          <div key={nft.tokenId} className="flex mt-2">
            <div className="mx-1">{nft.tokenURI}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
