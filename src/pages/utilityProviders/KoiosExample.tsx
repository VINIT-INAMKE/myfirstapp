'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KoiosProvider } from "@meshsdk/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

const KOIOS_TOKEN = process.env.NEXT_PUBLIC_KOIOS_TOKEN || "";

export default function KoiosExample() {
  const [address, setAddress] = useState<string>("");
  const koiosProvider = new KoiosProvider("preview", KOIOS_TOKEN);

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ["koiosExampleQuery", address],
    queryFn: async () => {
      if (!address) return null;
      return await koiosProvider.fetchAddressUTxOs(address);
    },
    enabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-none shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Koios Query</h2>
        </div>

        {!KOIOS_TOKEN && (
          <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-sm">
              A Koios Token is required. See{" "}
              <Link href="https://pbl.meshjs.dev/course/mesh/102/lesson/1" className="text-blue-300 hover:text-blue-200 underline">
                Mesh PBL Lesson 102.1
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-blue-200">
              Cardano Address (Preview)
            </label>
            <Input
              id="address"
              placeholder="Enter preview address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <Button 
            type="submit" 
            disabled={!KOIOS_TOKEN || !address || isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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
            <h3 className="text-sm font-medium mb-2 text-blue-200">Query Results:</h3>
            <pre className="p-4 rounded-lg bg-black/30 overflow-auto max-h-[400px] text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
