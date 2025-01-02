import { useState } from "react";
import type { NextPage } from "next";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import {
  AppWallet,
  AssetMetadata,
  ForgeScript,
  largestFirst,
  BlockfrostProvider,
  UTxO,
  Mint,
  Transaction,
 
  IWallet,
} from "@meshsdk/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BLOCKFROST_API_KEY = "your_blockfrost_api_key"; // Replace with your API key

const Home: NextPage = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Multi-Sign Transaction</h1>
          <p className="text-gray-300">Mint tokens with multi-signature verification</p>
        </div>

        {connected ? (
          <MintSection />
        ) : (
          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-bold">Connect Your Wallet</h2>
                <p className="text-purple-200">Please connect your wallet to access minting features</p>
                <div className="flex justify-center pt-4">
                  <CardanoWallet />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;

function MintSection() {
  const blockfrostProvider = new BlockfrostProvider(BLOCKFROST_API_KEY);
  const { wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>("");

  async function startMinting() {
    try {
      setSuccess(false);
      setTxHash(undefined);
      setError("");
      setLoading(true);

      const recipientAddress = await wallet.getChangeAddress();
      const UTxOs = await wallet.getUtxos();
      console.log("starting minting", { recipientAddress, UTxOs });
      
      const { unsignedTx } = await createTransaction(recipientAddress, UTxOs, wallet);
      const signedTx = await wallet.signTx(unsignedTx, true);
      const txHash = await wallet.submitTx(signedTx);
      
      console.log({ txHash });
      setTxHash(txHash);

      // Monitor transaction confirmation
      blockfrostProvider.onTxConfirmed(txHash, () => {
        console.log("Transaction confirmed");
        setSuccess(true);
      });
    } catch (err) {
      console.error("Minting failed:", err);
      setError(err instanceof Error ? err.message : "Minting failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-purple-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-purple-900 to-purple-800 text-white border-none shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Mint Token</h2>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/50">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {txHash ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/10">
                <p className="text-sm font-medium text-purple-200 mb-1">Transaction Hash:</p>
                <p className="font-mono text-sm break-all">{txHash}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/10">
                <p className="text-sm font-medium text-purple-200 mb-1">Status:</p>
                <p className="text-sm">
                  {success ? (
                    <span className="text-green-400">Transaction confirmed ✓</span>
                  ) : (
                    <span className="text-yellow-400">Waiting for confirmation...</span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <Button
              onClick={startMinting}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            >
              {loading ? "Processing..." : "Mint Token"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function createTransaction(recipientAddress: string, UTxOs: UTxO[], wallet: IWallet) {
  const blockfrostProvider = new BlockfrostProvider(BLOCKFROST_API_KEY);

  const appWallet = new AppWallet({
    networkId: 0,
    fetcher: blockfrostProvider,
    submitter: blockfrostProvider,
    key: {
      type: "mnemonic",
      words: [
        // Your mnemonic words here
      ],
    },
  });

  // Rest of the createTransaction function remains the same
  const appWalletAddress = appWallet.getPaymentAddress();
  const forgingScript = ForgeScript.withOneSignature(appWalletAddress);

  const assetName = "MeshToken";
  const assetMetadata: AssetMetadata = {
    name: "Mesh Token",
    image: "https://meshjs.dev/logo-mesh/mesh.png",
    mediaType: "image/png",
    description: "Token minted using Mesh SDK with Blockfrost provider",
  };

  const asset: Mint = {
    assetName: assetName,
    assetQuantity: "1",
    metadata: assetMetadata,
    label: "721",
    recipient: recipientAddress,
  };

  const costLovelace = "10000000";
  const bankWalletAddress = "addr_test1..."; // Your bank wallet address

  const selectedUTxOs = largestFirst(costLovelace, UTxOs, true);

  const tx = new Transaction({ initiator: wallet });
  tx.setTxInputs(selectedUTxOs);
  tx.mintAsset(forgingScript, asset);
  tx.sendLovelace(bankWalletAddress, costLovelace);
  tx.setChangeAddress(recipientAddress);

  const _unsignedTx = await tx.build();
  const unsignedTx = await appWallet.signTx(_unsignedTx, true);

  return { unsignedTx };
}