import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { BrowserWallet, UTxO } from "@meshsdk/core";
import { Alert } from "@/components/ui/alert";
import Head from "next/head";
import { useWallet, useLovelace } from "@meshsdk/react";

// Define the Wallet type
type Wallet = {
  id?: string;
  name: string;
  icon?: string;
  version: string;
};

const WalletsPage = () => {
  const { wallet, name} =
    useWallet();
  const lovelace = useLovelace();
  const [wallets, setWallets] = useState<Wallet[]>([]); 
  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedWalletName, setSelectedWalletName] = useState("");
  const [balance, setBalance] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [utxos, setUtxos] = useState<UTxO[] | null>(null);

  
  const fetchWallets = async () => {
    try {
      const availableWallets = await BrowserWallet.getAvailableWallets();
      setWallets(availableWallets); 
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
      alert("Unable to fetch wallets. Please try again.");
    }
  };
  const getWalletUtxos = async () => {
    try {
      setError("");
      if (!selectedWallet) {
        setError("Please select a wallet first");
        return;
      }
      console.log("Fetching UTXOs for wallet:", selectedWallet);
      const wallet = await BrowserWallet.enable(selectedWallet);
      const walletUtxos = await wallet.getUtxos();
      console.log("Received UTXOs:", walletUtxos);
      setUtxos(walletUtxos);
    } catch (error: unknown) {
      console.error("Failed to get UTXOs:", error);
      const walletError = error as { message: string };
      if (walletError.message?.includes("user canceled connection")) {
        setError("Wallet connection was cancelled. Please try again.");
      } else {
        setError("Unable to fetch UTXOs. Please try again.");
      }
    }
  };
  const handleWalletSelect = (walletId: string, walletName: string) => {
    // Modified to include name
    setSelectedWallet(walletId);
    setSelectedWalletName(walletName);
  };
  const getWalletBalance = () => {
    try {
      setError("");
      if (!selectedWallet) {
        setError("Please select a wallet first");
        return;
      }
      
      if (lovelace) {
        const adaBalance = (parseInt(lovelace) / 1000000).toFixed(6);
        setBalance(adaBalance);
      } else {
        setBalance("0");
      }
    } catch (error: unknown) {
      console.error("Failed to get balance:", error);
      setError("Unable to fetch balance. Please try again.");
    }
  };
  return (
    <div className="flex flex-col items-center content-center  min-h-screen bg-gray-900 w-full text-white text-center">
      <Head>
        <title>Mesh App on Cardano</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
      </Head>
      <div className="space-y-4 mt-10 w-80">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={fetchWallets}
              className="bg-white text-black hover:bg-gray-100 w-full"
            >
              {selectedWalletName || "Select Wallet"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white text-black">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Available Wallets</h4>
                <p className="text-sm text-muted-foreground">
                  Select a wallet to connect to your app.
                </p>
              </div>
              {wallets.length > 0 ? (
                <div className="grid gap-2 ">
                  {wallets.map((wallet) => (
                    <Button
                      key={wallet.id || wallet.name}
                      variant={
                        selectedWallet === wallet.id ? "default" : "outline"
                      }
                      onClick={() =>
                        handleWalletSelect(
                          wallet.id || wallet.name,
                          wallet.name
                        )
                      }
                      className="w-full bg-white text-black"
                    >
                      <div className="flex items-center gap-2">
                        <span>{wallet.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No wallets found. Make sure a wallet is installed and try
                  again.
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {error && (
          <Alert variant="destructive" className="bg-white text-black">
            {error}
          </Alert>
        )}

        {selectedWallet && (
          <div className="space-y-3">
            <Button
              onClick={getWalletBalance}
              className="bg-white text-black hover:bg-gray-100 w-full"
            >
              {balance ? `Balance: ${balance} ₳` : "Get Balance"}
            </Button>

            <Button
              onClick={getWalletUtxos}
              className="bg-white text-black hover:bg-gray-100 w-full"
            >
              Get UTXOs
            </Button>
          </div>
        )}

        {utxos && utxos.length >= 0 && (
          <div className="bg-white text-black p-4 rounded-md w-full mt-4">
            {utxos.length > 0 ? (
              <>
                <h4 className="font-medium mb-2">UTXOs ({utxos.length})</h4>
                <div className="max-h-60 overflow-auto">
                  {utxos.map((utxo, index) => (
                    <div key={index} className="mb-2 text-xs p-2 border rounded">
                      <div>TxHash: {utxo.input.txHash.slice(0, 20)}...</div>
                      <div>Output Index: {utxo.input.outputIndex}</div>
                      <div>
                        Amount:{" "}
                        {utxo.output.amount.find((a) => !a.unit)?.quantity || "0"}{" "}
                        lovelace
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                No UTXOs present in this wallet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletsPage;
