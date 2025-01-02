import { Transaction } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AssetTransferForm {
  recipientAddress: string;
  assetUnit: string;
  quantity: string;
  lovelaceAmount: string;
}

export default function SingleAsset() {
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<AssetTransferForm>({
    recipientAddress: "",
    assetUnit: "",
    quantity: "1",
    lovelaceAmount: "2000000",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
  };

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.recipientAddress || !formData.assetUnit || !formData.lovelaceAmount) {
      setError("Please fill in all fields");
      return;
    }

    if (parseInt(formData.lovelaceAmount) < 2000000) {
      setError("Minimum ADA amount must be at least 2 ADA (2,000,000 Lovelace)");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const tx = new Transaction({ initiator: wallet })
        .sendLovelace(formData.recipientAddress, formData.lovelaceAmount)
        .sendAssets(
          formData.recipientAddress,
          [{
            unit: formData.assetUnit,
            quantity: formData.quantity,
          }]
        );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("Transaction hash:", txHash);
      setSuccess(true);
      
      // Reset form
      setFormData({
        recipientAddress: "",
        assetUnit: "",
        quantity: "1",
        lovelaceAmount: "2000000",
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
      <div className="absolute -inset-1 bg-blue-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Send Single Asset</h2>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200">
                Recipient Address
              </label>
              <Input
                name="recipientAddress"
                placeholder="Enter Cardano address..."
                value={formData.recipientAddress}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200">
                Asset Unit
              </label>
              <Input
                name="assetUnit"
                placeholder="Enter asset unit..."
                value={formData.assetUnit}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200">
                ADA Amount (in Lovelace)
              </label>
              <Input
                type="number"
                name="lovelaceAmount"
                value={formData.lovelaceAmount}
                onChange={handleInputChange}
                min="2000000"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
              <p className="text-xs text-blue-200">
                Minimum 2 ADA (2,000,000 Lovelace) required for transaction
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200">
                Quantity
              </label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              {loading ? "Processing..." : "Send Asset"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
