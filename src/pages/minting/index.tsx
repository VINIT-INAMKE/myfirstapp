import { useState } from "react";
import { useWallet, CardanoWallet } from "@meshsdk/react";
import {  Transaction, ForgeScript, type Mint } from "@meshsdk/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mint Token</h1>
          <p className="text-gray-300">Create your own token on the Cardano blockchain</p>
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

function MintSection() {

  const { wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  async function startMinting() {
    setSuccess(false);
    setTxHash(undefined);
    setError(undefined);
    setLoading(true);

    try {
      const recipientAddress = await wallet.getChangeAddress();
      const forgingScript = ForgeScript.withOneSignature(recipientAddress);

      const assetMetadata = {
        name: 'Mesh Token',
        image: 'ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua',
        mediaType: 'image/jpg',
        description: 'This NFT was minted by Mesh (https://meshjs.dev/).',
      };

      const asset: Mint = {
        assetName: 'MeshToken',
        assetQuantity: '1',
        metadata: assetMetadata,
        label: "721" as `${number}`,
        recipient: recipientAddress,
      };

      const tx = new Transaction({ initiator: wallet });
      tx.mintAsset(forgingScript, asset);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx, true);
      const txHash = await wallet.submitTx(signedTx);

      setTxHash(txHash);
      setSuccess(true);
    } catch (error) {
      console.error("Minting failed", error);
      setError("Failed to mint token. Please try again.");
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

              <Button
                onClick={startMinting}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                Mint Another Token
              </Button>
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

export default Home;