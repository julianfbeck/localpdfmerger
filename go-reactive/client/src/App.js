import React, { Component } from 'react'
import './App.css'
const BrowserFS = require('browserfs')

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      message: '',
      mod: null,
      inst: null
    }
  }

  async componentDidMount () {
    BrowserFS.install(window)
    
    BrowserFS.configure(
      {
        fs: 'InMemory'
      },
      function (e) {
        if (e) {
          // An error happened!
          throw e
        }else {
          console.log("fileSystem init")
        }
        // Otherwise, BrowserFS is ready-to-use!
      }
    )

    WebAssembly.instantiateStreaming(
      fetch('pdfcpu.wasm'),
      window.go.importObject
    ).then(result => {
      // window.go.argv = [
      //   'pdfcpu.wasm',
      //   'trim',
      //   '-pages',
      //   '1',
      //   '/test.pdf',
      //   '/first_page.pdf'
      // ]

      window.go.argv = [
        'pdfcpu.wasm',
        'version',
      ]

      window.go.run(result.instance)
    })
    // WebAssembly.instantiateStreaming = async (resp, importObject) => {
    //   const source = await (await resp).arrayBuffer()
    //   return await WebAssembly.instantiate(source, importObject)
    // }
    // let { instance, module } = await WebAssembly.instantiateStreaming(fetch("main.wasm"), window.go.importObject)
    // await window.go.run(instance)
    // // saving to state.. tsk tsk not sure its the most optimal but i guess it works?? also, the value isnt that "big" anyway
    // this.setState({
    //   mod: module,
    //   inst: instance
    // })
  }



  render () {
    return (
      <div className='App'>
        <form>
          <input
            type='text'
            name=''
            id='userInput'
            onChange={e => this.handleChange(e)}
            style={{ marginTop: '100px' }}
          />
          <br />
          <button type='submit' onClick={e => this.handleSubmit(e)}>
            Click me to see MAGIC!!
          </button>
        </form>
        <br />
        <span id='message'>
          Ayomide Onigbinde wrote this!!😉...💕 from WebAssembly and Golang
        </span>
      </div>
    )
  }
}
// Configures BrowserFS to use the LocalStorage file system.

export default App
