import { PlutusScript, resolvePlutusScriptAddress, resolvePlutusScriptHash } from "@meshsdk/core";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PlutusScriptAddressExample() {
  const [scriptAddress, setScriptAddress] = useState<string>("");
  const [scriptHash, setScriptHash] = useState<string>("");
  const [scriptCode, setScriptCode] = useState<string>("4e4d01000033222220051200120011");

  const resolveScript = useCallback(() => {
    if (!scriptCode) return;
    
    const script: PlutusScript = {
      code: scriptCode,
      version: "V1",
    };

    const address = resolvePlutusScriptAddress(script);
    setScriptAddress(address);
    const hash = resolvePlutusScriptHash(address);
    setScriptHash(hash);
  }, [scriptCode]);

  useEffect(() => {
    resolveScript();
  }, [resolveScript]);

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-violet-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-violet-900 to-violet-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Plutus Script Address</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="scriptCode" className="text-sm font-medium text-violet-200">
                Script Code
              </label>
              <input
                id="scriptCode"
                placeholder="Enter script code..."
                value={scriptCode}
                onChange={(e) => setScriptCode(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <Button
              onClick={resolveScript}
              disabled={!scriptCode}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resolve Script
            </Button>

            {(scriptAddress || scriptHash) && (
              <div className="space-y-3">
                {scriptAddress && (
                  <div className="p-3 rounded-lg bg-black/30">
                    <p className="text-sm font-medium text-violet-200 mb-1">Script Address:</p>
                    <p className="font-mono text-sm break-all">{scriptAddress}</p>
                  </div>
                )}
                {scriptHash && (
                  <div className="p-3 rounded-lg bg-black/30">
                    <p className="text-sm font-medium text-violet-200 mb-1">Script Hash:</p>
                    <p className="font-mono text-sm break-all">{scriptHash}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
