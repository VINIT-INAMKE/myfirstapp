import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return (
    <MeshProvider>
      <Navbar />
      <Component {...pageProps} />
    </MeshProvider>
  );
}
