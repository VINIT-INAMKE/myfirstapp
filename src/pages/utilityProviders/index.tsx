import BlockfrostExample from "./BlockfrostExample";

import MaestroExample from "./MaestroExample";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Cardano Provider Examples 
          </h1>
          <p className="text-gray-400">
            Explore different Cardano blockchain providers and their capabilities
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Blockfrost Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-purple-500/20 rounded-lg blur-sm"></div>
            <BlockfrostExample />
          </div>

        

          {/* Maestro Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-lg blur-sm"></div>
            <MaestroExample />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Learn more about{" "}
            <a 
              href="https://meshjs.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              MeshJS
            </a>
            {" "}and Cardano blockchain providers
          </p>
        </footer>
      </div>
    </div>
  );
}
