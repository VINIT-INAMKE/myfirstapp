import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { BlockfrostProvider } from "@meshsdk/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

const blockfrostApiKey = "previewe0zgCEC3lNGhzitEoAdbmCg1bgWJ0Bio";

export default function BlockfrostExample() {
  const [address, setAddress] = useState<string>("");
  const blockfrostProvider = new BlockfrostProvider(blockfrostApiKey);

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ["blockfrostExampleQuery", address],
    queryFn: () => blockfrostProvider.fetchAddressUTxOs(address),
    enabled: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) refetch();
  };

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-purple-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-purple-900 to-purple-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Blockfrost Query</h2>
          </div>

          {blockfrostApiKey.length === 0 && (
            <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm">
                A Blockfrost API key is required. See{" "}
                <Link href="https://pbl.meshjs.dev/course/mesh/102/lesson/1" className="text-purple-300 hover:text-purple-200 underline">
                  Mesh PBL Lesson 102.1
                </Link>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-purple-200">
                Cardano Address
              </label>
              <input
                id="address"
                placeholder="Enter Cardano address..."
                value={address}
                onChange={(e) => {
                  console.log('Input change:', e.target.value);
                  setAddress(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50"
                type="text"
              />
            </div>

            <Button 
              type="submit" 
              disabled={!address || blockfrostApiKey.length === 0 || isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isLoading ? "Querying..." : "Query Address"}
            </Button>
          </form>

          {isLoading && (
            <div className="mt-6 p-4 rounded-lg bg-white/5 animate-pulse">
              Loading...
            </div>
          )}

          {isFetched && data && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2 text-purple-200">Query Results:</h3>
              <pre className="p-4 rounded-lg bg-black/30 overflow-auto max-h-[400px] text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}