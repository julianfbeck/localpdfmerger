import React, { Component, useEffect } from 'react'
import download from 'downloadjs'
import { useDropzone } from 'react-dropzone'
import './App.css'
const BrowserFS = require('browserfs')


function App () {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  useEffect(() => {
    BrowserFS.install(window)

    BrowserFS.configure(
      {
        fs: 'InMemory'
      },
      function (e) {
        if (e) {
          // An error happened!
          throw e
        } else {
          console.log('fileSystem init')
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

      window.go.argv = ['pdfcpu.wasm', 'version']

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
  }, [])

  return (
    <div className='App'>
      <div className='App'>
        <section className='container'>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <aside>
            <h4>Files</h4>
            <ul>{files}</ul>
          </aside>
        </section>
      </div>
    </div>
  )
}

// Configures BrowserFS to use the LocalStorage file system.

export default App
