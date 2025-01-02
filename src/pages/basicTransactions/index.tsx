import { CardanoWallet, useWallet } from "@meshsdk/react";
import SingleAddress from "./single-address";
import MultiAddresses from "./multi-addresses";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Basic Transactions</h1>
          <p className="text-gray-300">Send ADA to single or multiple addresses</p>
        </div>

        {connected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SingleAddress />
            <MultiAddresses />
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-bold">Connect Your Wallet</h2>
                <p className="text-blue-200">Please connect your wallet to access transaction features</p>
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
