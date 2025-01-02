"use client";

import Head from "next/head";
import { CardanoWallet } from "@meshsdk/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { VideoPlayer } from "@/components/VideoPlayer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Cardano Wallet Explorer</title>
        <meta name="description" content="Explore and manage your Cardano wallet with ease" />
      </Head>

      {/* Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Gradient Blob */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-3xl animate-blob" />
        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/30 to-cyan-500/30 blur-3xl animate-blob animation-delay-2000" />
        
        <div className="relative">
          <main className="container mx-auto px-6 py-20">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center space-y-12 pt-20">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Video Player */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="w-[320px] h-[400px] relative"
                >
                  <VideoPlayer
                    src="/hero.webm"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Text Content */}
                <div className="flex flex-col items-center space-y-6">
                  <motion.h1 
                    className="text-6xl md:text-7xl font-bold text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    Cardano Wallet
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"> Explorer</span>
                  </motion.h1>

                  <motion.p 
                    className="text-xl text-gray-300 max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  >
                    Connect your wallet to explore transactions, manage assets, and interact with the Cardano blockchain.
                  </motion.p>
                </div>
              </div>

              {/* Wallet Connection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                className="w-full max-w-md"
              >
                <CardanoWallet />
              </motion.div>

              {/* Feature Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              >
                <Link href="/walletinfo" className="group">
                  <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-4">Wallet Info</h3>
                    <p className="text-gray-300">View detailed information about your wallet, including balance and assets.</p>
                  </div>
                </Link>

                <Link href="/basicTransactions" className="group">
                  <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-4">Transactions</h3>
                    <p className="text-gray-300">Send and receive ADA with an intuitive transaction interface.</p>
                  </div>
                </Link>

                <Link href="/utilityProviders" className="group">
                  <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-4">Cardano Providers</h3>
                    <p className="text-gray-300">Access to various utility Providers from various Mesh Providers</p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
