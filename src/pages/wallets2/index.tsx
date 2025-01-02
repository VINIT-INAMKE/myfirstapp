import { CardanoWallet, useLovelace, useWallet } from "@meshsdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Importing the Button component

const WalletPage = () => {
  const { wallet, connected, connecting, name, connect, disconnect, error } =
    useWallet();
  const lovelace = useLovelace();
  const [showBalance, setShowBalance] = useState(false);

  const handleWalletConnected = () => {
    console.log("Wallet connected successfully!");
  };

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 to-blue-800">
      <div className="absolute top-4 right-4 transform transition-transform hover:-translate-y-1">
        <CardanoWallet
          label={connected ? `Connected` : "Connect Wallet"}
          onConnected={handleWalletConnected}
          isDark={true}
        />
      </div>
      <div className="flex flex-col items-center">
        <Button onClick={toggleBalance} disabled={connecting}>
          {showBalance
            ? `Lovelace Balance: ${lovelace} Lovelace`
            : "Show Lovelace Balance"}
        </Button>
      </div>
    </div>
  );
};

export default WalletPage;
