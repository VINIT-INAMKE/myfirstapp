import { CardanoWallet, useWallet } from "@meshsdk/react";
import Image from "next/image";
import Link from "next/link";

const navigationItems = [
  {
    title: "Utility Providers",
    href: "/utilityProviders",
    color: "text-purple-400 hover:text-purple-300",
  },
  {
    title: "Resolvers",
    href: "/utilityResolvers",
    color: "text-emerald-400 hover:text-emerald-300",
  },
  {
    title: "Wallet Info",
    href: "/walletinfo",
    color: "text-sky-400 hover:text-sky-300",
  },
  {
    title: "Basic Transaction",
    href: "/basicTransactions",
    color: "text-red-400 hover:text-red-300",
  },
  {
    title: "Asset Transaction",
    href: "/assetsTransaction",
    color: "text-yellow-400 hover:text-yellow-300",
  },  {
    title: "Multi Signed Transaction",
    href: "/multiSignTransactions",
    color: "text-yellow-400 hover:text-yellow-300",
  },
  
];

export const Navbar = () => {
  const { connected } = useWallet();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-700 bg-gray-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/favicon.ico" alt="Logo" width={36} height={36} />
              <span className="text-xl font-semibold text-white">Mesh App</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`${item.color} text-sm font-medium transition-colors`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <CardanoWallet
              label={connected ? "Connected" : "Connect Wallet"}
              isDark={true}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
