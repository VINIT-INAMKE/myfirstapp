import PlutusScriptAddressExample from "./PlutusScriptAddressExample";
import RewardAddressExample from "./RewardAddressExample";
import SlotEpochExample from "./SlotEpochExample";
import TransactionHashExample from "./TransactionHashExample";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Cardano Resolver Examples
          </h1>
          <p className="text-gray-400">Explore different Resolver Examples</p>
        </div>

        <div className="space-y-6">
          {/* PlutusScriptAddressExample Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-purple-500/20 rounded-lg blur-sm"></div>
            <PlutusScriptAddressExample />
          </div>
          {/* RewardAddressExample Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-lg blur-sm"></div>
            <RewardAddressExample />
          </div>
          {/* SlotEpochExample Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-lg blur-sm"></div>
            <SlotEpochExample />
          </div>{" "}
          {/* TransactionHashExample Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-lg blur-sm"></div>
            <TransactionHashExample />
          </div>
        </div>
      </div>
    </div>
  );
}
