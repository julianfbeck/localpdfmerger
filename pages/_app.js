import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as gtag from '../scripts/gtag'


function MyApp ({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <ChakraProvider>
      <div className="custom">
      <Component {...pageProps} />
      </div>
    </ChakraProvider>
  )
}

export default MyApp
