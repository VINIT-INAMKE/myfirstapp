import { CardanoWallet, useWallet } from "@meshsdk/react";
import {
  PlutusScript,
  Transaction,
  resolvePlutusScriptAddress,
  BlockfrostProvider,
  resolvePaymentKeyHash,
  Data,
  resolveDataHash,
  UTxO,
} from "@meshsdk/core";
import { useState, useEffect } from "react";
import plutusScript from "./plutus.json";
import cbor from "cbor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const script: PlutusScript = {
  code: cbor
    .encode(Buffer.from(plutusScript.validators[0].compiledCode, "hex"))
    .toString("hex"),
  version: "V2",
};
const scriptAddress = resolvePlutusScriptAddress(script, 0);
const redeemerData = "Hello, World!";
const lovelaceAmount = "3000000";

const blockfrost_api_key = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD || "previewe0zgCEC3lNGhzitEoAdbmCg1bgWJ0Bio";
const blockchainProvider = new BlockfrostProvider(blockfrost_api_key);

enum States {
  init,
  locking,
  lockingConfirming,
  locked,
  unlocking,
  unlockingConfirming,
  unlocked,
}

const stateDescriptions = {
  [States.init]: "Initializing",
  [States.locking]: "Locking assets",
  [States.lockingConfirming]: "Confirming the locking of assets",
  [States.locked]: "Assets locked",
  [States.unlocking]: "Unlocking assets",
  [States.unlockingConfirming]: "Confirming the unlocking of assets",
  [States.unlocked]: "Assets unlocked",
};

export default function Page() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Smart Contract</h1>
          <p className="text-gray-300">Lock and unlock assets using Plutus smart contracts</p>
        </div>

        {connected ? (
          <Demo />
        ) : (
          <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-bold">Connect Your Wallet</h2>
                <p className="text-indigo-200">Please connect your wallet to interact with smart contracts</p>
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
}

function Demo() {
  const { wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [state, setState] = useState(States.init);
  const [txHash, setTxHash] = useState<string>("");
  const [lockedAssets, setLockedAssets] = useState<UTxO[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<UTxO | null>(null);

  useEffect(() => {
    async function fetchLockedAssets() {
      try {
        const utxos = await blockchainProvider.fetchAddressUTxOs(scriptAddress, "lovelace");
        const locked = await Promise.all(utxos.map(async (utxo: UTxO) => {
          const dataHash = resolveDataHash({
            alternative: 0,
            fields: [resolvePaymentKeyHash((await wallet.getUsedAddresses())[0])],
          });
          return utxo.output.dataHash === dataHash ? utxo : null;
        }));
        setLockedAssets(locked.filter((utxo): utxo is UTxO => utxo !== null));
      } catch (err) {
        console.error("Failed to fetch locked assets:", err);
        setError("Failed to fetch locked assets. Please try again.");
      }
    }

    if (state === States.init || state === States.locked) {
      fetchLockedAssets();
    }
  }, [state, blockchainProvider, scriptAddress, wallet]);

  async function lockAssets() {
    setState(States.locking);
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const hash = resolvePaymentKeyHash((await wallet.getUsedAddresses())[0]);
      const datum: Data = {
        alternative: 0,
        fields: [hash],
      };

      const tx = new Transaction({ initiator: wallet }).sendLovelace(
        {
          address: scriptAddress,
          datum: { value: datum },
        },
        lovelaceAmount
      );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("txHash", txHash);
      setSuccess(true);

      if (txHash) {
        setState(States.lockingConfirming);
        blockchainProvider.onTxConfirmed(txHash, () => {
          setState(States.locked);
          window.location.reload();
        }, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lock failed");
    } finally {
      setLoading(false);
    }
  }

  async function unlockAssets() {
    setLoading(true);
    setState(States.unlocking);
    setError("");
    setSuccess(false);

    try {
      const address = (await wallet.getUsedAddresses())[0];
      const hash = resolvePaymentKeyHash(address);
      const datum: Data = {
        alternative: 0,
        fields: [hash],
      };

      const assetUtxo = await _getAssetUtxo({
        scriptAddress,
        asset: "lovelace",
        datum,
      });

      if (!assetUtxo) {
        throw new Error("No UTXO found for the given datum");
      }

      const redeemer = { data: { alternative: 0, fields: [redeemerData] } };
      const tx = new Transaction({ initiator: wallet, fetcher: blockchainProvider })
        .redeemValue({
          value: assetUtxo,
          script,
          datum,
          redeemer,
        })
        .sendValue(address, assetUtxo)
        .setRequiredSigners([address]);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx, true);
      const txHash = await wallet.submitTx(signedTx);
      console.log("txHash", txHash);
      setTxHash(txHash);
      setSuccess(true);

      if (txHash) {
        setState(States.unlockingConfirming);
        blockchainProvider.onTxConfirmed(txHash, () => {
          setState(States.unlocked);
          window.location.reload();
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unlock failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-indigo-500/20 rounded-lg blur-sm -z-10"></div>
      <div className="text-center mb-4">
        <p className="text-lg font-bold text-white">Current State: {stateDescriptions[state]}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Lock Assets</h2>
            <Button
              onClick={lockAssets}
              disabled={loading || state !== States.init}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
            >
              {loading && state === States.locking ? "Locking..." : "Lock Assets"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white border-none shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Unlock Assets</h2>
            <select
              className="w-full mb-4 p-2 bg-gray-800 border border-white/20 text-white"
              value={selectedAsset ? `${selectedAsset.input.txHash}-${selectedAsset.input.outputIndex}` : ""}
              onChange={(e) => {
                const [txHash, outputIndex] = e.target.value.split("-");
                const asset = lockedAssets.find(
                  (utxo) => utxo.input.txHash === txHash && utxo.input.outputIndex === parseInt(outputIndex)
                );
                setSelectedAsset(asset || null);
              }}
            >
              <option value="" disabled>Select an asset to unlock</option>
              {lockedAssets.map((utxo, index) => (
                <option key={index} value={`${utxo.input.txHash}-${utxo.input.outputIndex}`}>
                  {`TxHash: ${utxo.input.txHash.slice(0, 8)}...${utxo.input.txHash.slice(-8)}, Output: ${utxo.input.outputIndex}`}
                </option>
              ))}
            </select>
            <Button
              onClick={unlockAssets}
              disabled={loading || !selectedAsset}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
            >
              {loading && state === States.unlocking ? "Unlocking..." : "Unlock Assets"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {success && (
        <div className="p-3 mt-4 rounded-lg bg-green-500/20 border border-green-500/50">
          <p className="text-sm text-green-200">Transaction was successful!</p>
        </div>
      )}

      {error && (
        <div className="p-3 mt-4 rounded-lg bg-red-500/20 border border-red-500/50">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="p-3 mt-4 rounded-lg bg-blue-500/20 border border-blue-500/50">
          <p className="text-sm text-blue-200">Transaction ID: {txHash}</p>
        </div>
      )}
    </div>
  );
}

async function _getAssetUtxo({
  scriptAddress,
  asset,
  datum,
}: {
  scriptAddress: string;
  asset: string;
  datum: Data;
}) {
  const utxos = await blockchainProvider.fetchAddressUTxOs(scriptAddress, asset);
  const dataHash = resolveDataHash(datum);
  return utxos.find((utxo: UTxO) => utxo.output.dataHash == dataHash);
}