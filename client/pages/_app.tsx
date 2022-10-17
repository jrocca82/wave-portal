import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ConnectionContextProvider } from "../context/ConnectionContext";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ConnectionContextProvider>
      <ChakraProvider>
			<Component {...pageProps} />
      </ChakraProvider>
		</ConnectionContextProvider>
	);
}

export default MyApp;
