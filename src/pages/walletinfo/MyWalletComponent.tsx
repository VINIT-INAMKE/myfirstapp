import Image from "next/image";
import {
  useWallet,
  useAssets,
  useWalletList,
  useAddress,
  useLovelace,
  useNetwork,
} from "@meshsdk/react";
import { useState } from "react";
import { BlockfrostProvider, type UTxO } from "@meshsdk/core";
import { Button } from "@/components/ui/button";

const blockfrostApiKey = "previewe0zgCEC3lNGhzitEoAdbmCg1bgWJ0Bio";

export default function WalletHooksExamples() {
  const wallet = useWallet();
  const assets = useAssets();
  const walletList = useWalletList();
  const address = useAddress();
  const lovelace = useLovelace();
  const network = useNetwork();
  
  const [utxos, setUtxos] = useState<UTxO[]>([]);
  const [isLoadingUtxos, setIsLoadingUtxos] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchUTXOs = async () => {
    if (!address || !blockfrostApiKey) return;
    
    setIsLoadingUtxos(true);
    setError("");
    
    try {
      const blockfrostProvider = new BlockfrostProvider(blockfrostApiKey);
      const utxoList = await blockfrostProvider.fetchAddressUTxOs(address);
      setUtxos(utxoList);
      console.log(utxoList);
    } catch (err) {
      console.error("Failed to fetch UTXOs:", err);
      setError("Failed to fetch UTXOs. Please try again.");
    } finally {
      setIsLoadingUtxos(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Wallet List Section */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Available Wallets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {walletList.map((item) => (
            <div
              key={item.name}
              className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg"
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                {item.version && (
                  <p className="text-sm text-gray-400">v{item.version}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wallet Status Section */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Wallet Status</h2>
        <div className="space-y-2">
          <p className="flex items-center space-x-2">
            <span className="font-semibold">Connection Status:</span>
            <span
              className={`px-2 py-1 rounded ${
                wallet.connected ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {wallet.connected ? "Connected" : "Not Connected"}
            </span>
          </p>

          {address && (
            <p className="flex items-center space-x-2">
              <span className="font-semibold">Address:</span>
              <span className="font-mono text-sm bg-gray-700 p-1 rounded">
                {`${address.slice(0, 20)}...${address.slice(-8)}`}
              </span>
            </p>
          )}

          {lovelace && (
            <p className="flex items-center space-x-2">
              <span className="font-semibold">Balance:</span>
              <span className="font-mono bg-gray-700 p-1 rounded">
                {(parseInt(lovelace) / 1000000).toFixed(6)} ₳
              </span>
            </p>
          )}

          <p className="flex items-center space-x-2">
            <span className="font-semibold">Network:</span>
            <span
              className={`px-2 py-1 rounded ${
                network === 1 ? "bg-purple-500" : "bg-blue-500"
              }`}
            >
              {network === 1 ? "Mainnet" : "Testnet"}
            </span>
          </p>
        </div>
      </section>

      {/* UTXOs Section */}
      <section className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">UTXOs</h2>
          <Button
            onClick={fetchUTXOs}
            disabled={isLoadingUtxos || !wallet.connected}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoadingUtxos ? "Loading..." : "Refresh UTXOs"}
          </Button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/50">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {utxos.length > 0 ? (
            <div className="space-y-3">
              {utxos.map((utxo, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-sm text-gray-300">
                      TxHash: {`${utxo.input.txHash.slice(0, 8)}...${utxo.input.txHash.slice(-8)}`}
                    </span>
                    <span className="text-sm bg-gray-600 px-2 py-1 rounded">
                      Output #{utxo.input.outputIndex}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {utxo.output.amount.map((amt, i) => (
                      <p key={i} className="text-sm text-gray-300">
                        <span className="font-medium">
                          {amt.unit === "lovelace" 
                            ? `${(parseInt(amt.quantity) / 1000000).toFixed(6)} ₳`
                            : `${amt.quantity} ${amt.unit.slice(0, 8)}...`}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              {isLoadingUtxos 
                ? "Loading UTXOs..." 
                : wallet.connected 
                  ? "No UTXOs found. Click refresh to load." 
                  : "Connect your wallet to view UTXOs"}
            </p>
          )}
        </div>
      </section>

      {/* Assets Section */}
      {assets && (
        <section className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Assets</h2>
          <div className="max-h-60 overflow-y-auto">
            {assets.length > 0 ? (
              assets.map((asset, index) => (
                <div key={index} className="bg-gray-700 p-2 rounded mb-2">
                  <p className="font-mono text-sm">
                    {`${asset.unit.slice(0, 15)}...${asset.unit.slice(-8)}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    Quantity: {asset.quantity}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No Assets available</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
