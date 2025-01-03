import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      staleTime: 1000 * 60 * 5, 
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MeshProvider>
        <Navbar />
        <Component {...pageProps} />
      </MeshProvider>
    </QueryClientProvider>
  );
}
