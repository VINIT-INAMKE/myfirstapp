'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { MaestroProvider } from "@meshsdk/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";


const MAESTRO_API_KEY = "3lx67x6yU5lb4K5XuBhOPYMewLut94Nl";

export default function MaestroExample() {
  const [address, setAddress] = useState<string>("");
  
  const maestroProvider = new MaestroProvider({
    network: "Preview",
    apiKey: MAESTRO_API_KEY,
    turboSubmit: false,
  });

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ["maestroQuery", address],
    queryFn: async () => {
      if (!address) return null;
      return await maestroProvider.fetchAddressUTxOs(address);
    },
    enabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-emerald-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Maestro Query</h2>
          </div>

          {!MAESTRO_API_KEY && (
            <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm">
                A Maestro API key is required. Get yours by{" "}
                <Link 
                  href="https://docs.gomaestro.org/docs/Getting-started/Sign-up-login"
                  className="text-emerald-300 hover:text-emerald-200 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  signing up with Maestro
                </Link>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="maestro-address" className="text-sm font-medium text-emerald-200">
                Cardano Address (Preview)
              </label>
              <input
                id="maestro-address"
                placeholder="Enter preview address..."
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
              disabled={!MAESTRO_API_KEY || !address || isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
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
              <h3 className="text-sm font-medium mb-2 text-emerald-200">Query Results:</h3>
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