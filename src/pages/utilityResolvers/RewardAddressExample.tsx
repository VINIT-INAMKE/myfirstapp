import { resolveRewardAddress } from "@meshsdk/core";
import { useAddress, useWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function RewardAddressExample() {
  const {  connected } = useWallet();
  const address = useAddress();
  const [rewardAddress, setRewardAddress] = useState<string>("");

  useEffect(() => {
    if (address) {
      setRewardAddress(resolveRewardAddress(address));
    }
  }, [address]);

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-cyan-900 to-cyan-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Reward Address</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/10">
              <p className="text-sm">
                Connection Status:{" "}
                <span className={`font-bold ${connected ? "text-green-400" : "text-red-400"}`}>
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </p>
            </div>

            {connected && rewardAddress && (
              <div className="p-3 rounded-lg bg-black/30">
                <p className="text-sm font-medium text-cyan-200 mb-1">Reward Address:</p>
                <p className="font-mono text-sm break-all">{rewardAddress}</p>
              </div>
            )}

            {!connected && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50">
                <p className="text-sm">Please connect your wallet to view the reward address</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
