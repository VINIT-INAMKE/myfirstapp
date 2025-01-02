import { resolveEpochNo, resolveSlotNo } from "@meshsdk/core";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function SlotEpochExample() {
  const [slot, setSlot] = useState<string>("0");
  const [epoch, setEpoch] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlot(resolveSlotNo("preview"));
      setEpoch(resolveEpochNo("preview"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-teal-500/20 rounded-lg blur-sm -z-10"></div>
      <Card className="bg-gradient-to-br from-teal-900 to-teal-800 text-white border-none shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Network Time</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-black/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-teal-200">Current Slot</span>
                <span className="text-xs text-teal-300">Updates every second</span>
              </div>
              <p className="font-mono text-2xl">{slot}</p>
            </div>

            <div className="p-4 rounded-lg bg-black/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-teal-200">Current Epoch</span>
                <span className="text-xs text-teal-300">Preview network</span>
              </div>
              <p className="font-mono text-2xl">{epoch}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
