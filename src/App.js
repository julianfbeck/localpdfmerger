import React from 'react'
import customTheme from './styles/theme'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

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
    <div >
    <ChakraProvider theme={theme} >
      <div className="custom"  >
        <ProgressBar style={{ marginBottom: '10px' }} />
        <BrowserRouter>
            <Switch>
              <Route exact path='/'>
              <Merge ></Merge>
              </Route>
              <Route path='/merge'>
              <Merge></Merge>
              </Route>
            </Switch>
          </BrowserRouter>
      </div>
    </ChakraProvider>
    </div>
  )
}

export default App
