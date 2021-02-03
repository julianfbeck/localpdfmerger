import React from 'react'

import customTheme from './styles/theme'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './App.css'
import {
  progressBarFetch,
  ProgressBar,
  setOriginalFetch
} from 'react-fetch-progressbar'
import Merge from './pages/merge'

const theme = extendTheme(customTheme)

setOriginalFetch(window.fetch)
window.fetch = progressBarFetch

//global variables outside

function App () {
  return (
    <ChakraProvider theme={theme}>
      <div className='App'>
        <ProgressBar style={{ marginBottom: '10px' }} />
        <Merge></Merge>
      </div>
    </ChakraProvider>
  )
}

export default App
