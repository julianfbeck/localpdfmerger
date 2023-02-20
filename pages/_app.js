import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import PlausibleProvider from "next-plausible";
import WithSubnavigation from '../components/Navbar';


function MyApp ({ Component, pageProps }) {
  return (
    
    <PlausibleProvider domain="localpdf.tech" selfHosted customDomain="https://plausible.home.juli.sh" trackLocalhost enabled>
    <ChakraProvider>
      <div className="custom">
      <WithSubnavigation />
      <Component {...pageProps} />
      </div>
    </ChakraProvider>
    </PlausibleProvider>
  )
}

export default MyApp
