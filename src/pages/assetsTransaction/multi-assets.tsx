import { Transaction } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Asset {
  assetUnit: string;
  quantity: string;
}

interface AssetTransfer {
  recipientAddress: string;
  assets: Asset[];
  lovelaceAmount: string;
}

export default function MultiAssets() {
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<AssetTransfer>({
    recipientAddress: "",
    assets: [{ assetUnit: "", quantity: "1" }],
    lovelaceAmount: "1000000",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "recipientAddress" || name === "lovelaceAmount") {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError("");
    setSuccess(false);
  };

  const handleAssetChange = (index: number, field: keyof Asset, value: string) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, i) =>
        i === index ? { ...asset, [field]: value } : asset
      ),
    }));
    setError("");
    setSuccess(false);
  };

  const addAssetField = () => {
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, { assetUnit: "", quantity: "1" }],
    }));
  };

  const removeAssetField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index),
    }));
  };

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.recipientAddress || !formData.lovelaceAmount) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.assets.some(asset => !asset.assetUnit)) {
      setError("Please fill in all asset units");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tx = new Transaction({ initiator: wallet })
        .sendLovelace(
          formData.recipientAddress,
          formData.lovelaceAmount
        )
        .sendAssets(
          formData.recipientAddress,
          formData.assets.map(asset => ({
            unit: asset.assetUnit,
            quantity: asset.quantity,
          }))
        );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("Transaction hash:", txHash);
      setSuccess(true);
      
      // Reset form
      setFormData({
        recipientAddress: "",
        assets: [{ assetUnit: "", quantity: "1" }],
        lovelaceAmount: "1000000",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-purple-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-purple-900 to-purple-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Send Multiple Assets</h2>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">
                Recipient Address
              </label>
              <Input
                name="recipientAddress"
                placeholder="Enter Cardano address..."
                value={formData.recipientAddress}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {formData.assets.map((asset, index) => (
              <div key={index} className="space-y-4 p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-purple-200">Asset {index + 1}</h3>
                  {formData.assets.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeAssetField(index)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm p-2"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200">
                    Asset Unit
                  </label>
                  <Input
                    value={asset.assetUnit}
                    onChange={(e) => handleAssetChange(index, "assetUnit", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Enter asset unit..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    value={asset.quantity}
                    onChange={(e) => handleAssetChange(index, "quantity", e.target.value)}
                    min="1"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addAssetField}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white mb-4"
            >
              Add Another Asset
            </Button>

            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200">
                ADA Amount (in Lovelace)
              </label>
              <Input
                type="number"
                name="lovelaceAmount"
                value={formData.lovelaceAmount}
                onChange={handleInputChange}
                min="1000000"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <p className="text-xs text-purple-200">
                1 ADA = 1,000,000 Lovelace
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50">
                <p className="text-sm text-green-200">Transaction submitted successfully!</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!connected || loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            >
              {loading ? "Processing..." : "Send Assets"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
