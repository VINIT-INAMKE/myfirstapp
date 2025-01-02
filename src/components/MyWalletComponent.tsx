import React from "react";
import {useLovelace } from "@meshsdk/react";

export default function MyWalletComponent() {

  const lovelace = useLovelace();

  return (
    <div>
    

      <p>
        My ADA balance:{" "}
        {lovelace ? (parseInt(lovelace) / 1000000).toFixed(2) : "0.00"} ADA
      </p>
    </div>
  );
}
