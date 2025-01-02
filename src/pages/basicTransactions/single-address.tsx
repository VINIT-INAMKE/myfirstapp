import { Transaction } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SingleAddress() {
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  async function handleTransaction() {
    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!recipientAddress || !amount) {
      setError("Please fill in both address and amount");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const tx = new Transaction({ initiator: wallet }).sendLovelace(
        recipientAddress,
        amount
      );
      
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      
      console.log("Transaction submitted:", txHash);
      setSuccess(true);
      setRecipientAddress("");
      setAmount("");
    } catch (err) {
      console.error("Transaction failed:", err);
      setError("Transaction failed. Please try again.");
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Send ADA</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-blue-200">
                Recipient Address
              </label>
              <Input
                id="address"
                placeholder="Enter Cardano address..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-blue-200">
                Amount (in Lovelace)
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount in Lovelace..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <p className="text-xs text-blue-200">
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
              onClick={handleTransaction}
              disabled={!connected || loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              {loading ? "Processing..." : "Send ADA"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
