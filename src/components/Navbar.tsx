import { CardanoWallet, useLovelace, useWallet } from "@meshsdk/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const { connected, } =
    useWallet();

  return (
    <nav className="flex items-center  justify-between h-full w-full bg-inherit">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href="/">
          <Image src="/favicon.ico" alt="Logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl">Mesh App</h3>
      </div>
      <CardanoWallet
        label={connected ? `Connected` : "Connect Wallet"}
        isDark={true}
      />
    </nav>
  );
};
