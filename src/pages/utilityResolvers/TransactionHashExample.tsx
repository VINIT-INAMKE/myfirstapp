import { Data, Transaction, resolveDataHash, resolveTxHash } from "@meshsdk/core";
import { useAddress, useWallet } from "@meshsdk/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransactionHashExample() {
  const { wallet, connected } = useWallet();
  const address = useAddress();
  const [dataHash, setDataHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const getTxHash = async () => {
    if (!connected || !address) return;
    const datum: Data = "usefuldatumfortransaction";
    const dataHash = resolveDataHash(datum);
    setDataHash(dataHash);
    const tx = new Transaction({ initiator: wallet });
    tx.sendLovelace({ address, datum: { value: dataHash } }, "1500000");
    const unsignedTx = await tx.build();
    const txHash = resolveTxHash(unsignedTx);
    setTxHash(txHash);
  };

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-orange-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-orange-900 to-orange-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Transaction Hash Resolver</h2>
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

            <Button
              onClick={getTxHash}
              disabled={!connected}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connected ? "Get Transaction Hash" : "Connect Wallet First"}
            </Button>

            {(dataHash || txHash) && (
              <div className="space-y-3 mt-4">
                {dataHash && (
                  <div className="p-3 rounded-lg bg-black/30">
                    <p className="text-sm font-medium text-orange-200 mb-1">Data Hash:</p>
                    <p className="font-mono text-sm break-all">{dataHash}</p>
                  </div>
                )}
                {txHash && (
                  <div className="p-3 rounded-lg bg-black/30">
                    <p className="text-sm font-medium text-orange-200 mb-1">Transaction Hash:</p>
                    <p className="font-mono text-sm break-all">{txHash}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
