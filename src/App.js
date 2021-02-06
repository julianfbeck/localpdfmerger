import React from 'react'
import customTheme from './styles/theme'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Analytics from 'react-router-ga'
import './App.css'
import {
  progressBarFetch,
  ProgressBar,
  setOriginalFetch
} from 'react-fetch-progressbar'
import Merge from './pages/merge'
import Landing from './pages/Landing'


const theme = extendTheme(customTheme)

setOriginalFetch(window.fetch)
window.fetch = progressBarFetch

//global variables outside

function App () {
  return (
    <div>
      <ChakraProvider theme={theme}>
        <div className='custom'>
          <ProgressBar style={{ marginBottom: '10px' }} />
          <BrowserRouter>
            <Analytics id='UA-123121612-3'>
              <Switch>
                <Route exact path='/'>
                  <Landing></Landing>
                </Route>
                <Route path='/merge'>
                  <Merge></Merge>
                </Route>
              </Switch>
            </Analytics>
          </BrowserRouter>
        </div>
      </ChakraProvider>
    </div>
  )
}

export default App
