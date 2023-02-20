import "../styles/globals.css";
import { Box, ChakraProvider } from "@chakra-ui/react";
import PlausibleProvider from "next-plausible";
import WithSubnavigation from "../components/Navbar";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider
      domain="localpdf.tech"
      selfHosted
      customDomain="https://plausible.home.juli.sh"
      trackLocalhost
      enabled
    >
      <ChakraProvider>
        <div className="custom">
          <WithSubnavigation />
          <Box h="calc(100vh)">
            <Component {...pageProps} />
          </Box>
          <Footer />
        </div>
      </ChakraProvider>
    </PlausibleProvider>
  );
}

export default MyApp;
