import { Transaction } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Recipient {
  address: string;
  amount: string;
}

export default function MultiAddresses() {
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: "", amount: "" },
    { address: "", amount: "" },
  ]);

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index][field] = value;
    setRecipients(newRecipients);
  };

  const addRecipient = () => {
    setRecipients([...recipients, { address: "", amount: "" }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 2) {
      const newRecipients = recipients.filter((_, i) => i !== index);
      setRecipients(newRecipients);
    }
  };

  async function handleTransaction() {
    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }

    const invalidRecipients = recipients.filter(
      (r) => !r.address || !r.amount
    );
    if (invalidRecipients.length > 0) {
      setError("Please fill in all addresses and amounts");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const tx = new Transaction({ initiator: wallet });
      
      recipients.forEach((recipient) => {
        tx.sendLovelace(recipient.address, recipient.amount);
      });

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      
      console.log("Transaction submitted:", txHash);
      setSuccess(true);
    
      setRecipients([
        { address: "", amount: "" },
        { address: "", amount: "" },
      ]);
    } catch (err) {
      console.error("Transaction failed:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-indigo-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Send to Multiple Recipients</h2>
          </div>

          <div className="space-y-6">
            {recipients.map((recipient, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-indigo-200">
                    Recipient {index + 1}
                  </h3>
                  {recipients.length > 2 && (
                    <Button
                      onClick={() => removeRecipient(index)}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-indigo-200 hover:text-white hover:bg-indigo-700"
                    >
                      ✕
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">
                    Address
                  </label>
                  <Input
                    placeholder="Enter Cardano address..."
                    value={recipient.address}
                    onChange={(e) => updateRecipient(index, "address", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">
                    Amount (in Lovelace)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount in Lovelace..."
                    value={recipient.amount}
                    onChange={(e) => updateRecipient(index, "amount", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            ))}

            <Button
              onClick={addRecipient}
              variant="outline"
              className="w-full border-indigo-500/50 text-indigo-200 hover:bg-indigo-700 hover:text-white"
            >
              + Add Another Recipient
            </Button>

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
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
            >
              {loading ? "Processing..." : "Send to All Recipients"}
            </Button>

            <p className="text-xs text-center text-indigo-200">
              1 ADA = 1,000,000 Lovelace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
