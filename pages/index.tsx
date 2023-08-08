import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { useContractRead, useContractEvent } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import VotingAppABI from "../contracts/VotingApp.json";

const inter = Inter({ subsets: ["latin"] });

const CONTRACT_ADDRESS = "0xD5FB8399d51dc37AfD57c4db8073393C2015e696";

export default function Home() {
  const [firstCandidateVoteCount, setFirstCandidateVoteCount] = useState(
    BigInt(0)
  );
  const [secondCandidateVoteCount, setSecondCandidateVoteCount] = useState(
    BigInt(0)
  );

  const firstCandidate = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: VotingAppABI,
    functionName: "candidates",
    args: [0],
  });
  const secondCandidate = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: VotingAppABI,
    functionName: "candidates",
    args: [1],
  });

  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: VotingAppABI,
    eventName: "UpdatedVotingResult",
    listener(log) {
      console.log("%cinfo: ", "font-size: 12px; color: #00b3b3", log);
      setFirstCandidateVoteCount(
        BigInt(
          log?.[0]?.args?.firstCandidateVoteCount || firstCandidateVoteCount
        )
      );
      setSecondCandidateVoteCount(
        BigInt(
          log?.[0]?.args?.setSecondCandidateVoteCount ||
            secondCandidateVoteCount
        )
      );
    },
  });

  useEffect(() => {
    setFirstCandidateVoteCount(
      BigInt(firstCandidate.data?.[1] || firstCandidateVoteCount)
    );
    setSecondCandidateVoteCount(
      BigInt(secondCandidate.data?.[1] || secondCandidateVoteCount)
    );
  }, [
    firstCandidate.data,
    secondCandidate.data,
    firstCandidateVoteCount,
    secondCandidateVoteCount,
  ]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <p>Voting Results</p>
      <div className="pt-10 z-10 max-w-5xl items-center gap-4 font-mono text-sm lg:flex">
        <p className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Candidate 1: {firstCandidateVoteCount.toString()}
        </p>
        <p className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Candidate 2: {secondCandidateVoteCount.toString()}
        </p>
      </div>
    </main>
  );
}
