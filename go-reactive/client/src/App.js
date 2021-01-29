import React, { useEffect, useMemo, useState, useCallback } from 'react'
import download from 'downloadjs'
import { useDropzone } from 'react-dropzone'
import './App.css'
import {
  progressBarFetch,
  ProgressBar,
  setOriginalFetch
} from 'react-fetch-progressbar'
import { Promise } from "bluebird";

const BrowserFS = require('browserfs')

setOriginalFetch(window.fetch)
window.fetch = progressBarFetch

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}

const activeStyle = {
  borderColor: '#2196f3'
}

const acceptStyle = {
  borderColor: '#00e676'
}

const rejectStyle = {
  borderColor: '#ff1744'
}
//global variables outside
let fs
let Buffer
let wasmInstance
let wasmModule
let go

function App () {
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasLoadedWasm, setHasLoadedWasm] = useState(false)

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: 'application/pdf' })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  )

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  const mergeFiles = useCallback(async () => {
    // don't send again while we are sending
    if (isProcessing) return
    // update state
    setIsProcessing(true)
    // send the actual request
    await validate()
    // once the request is sent, update state again
    //if (isMounted.current) // only update if we are still mounted
    setIsProcessing(false)
  }, [isProcessing])

  const init = useCallback(async () => {
    BrowserFS.install(window)
    BrowserFS.configure(
      {
        fs: 'LocalStorage'
      },
      e => {
        if (e) {
          // An error happened!
          throw e
        } else {
          fs = Promise.promisifyAll(BrowserFS.BFSRequire('fs'));
          Buffer = BrowserFS.BFSRequire('buffer').Buffer
          console.log('fileSystem init')
        }
        // Otherwise, BrowserFS is ready-to-use!
      }
    )
    WebAssembly.instantiateStreaming(
      fetch('pdfcpu.wasm'),
      window.go.importObject
    ).then(result => {
      wasmInstance = result.instance
      wasmModule = result.module
      go = window.go

      // window.go.argv = ['pdfcpu.wasm', 'version']
      // window.go.run(wasmInstance)
      // window.go.argv = ['pdfcpu.wasm', 'version']
      // window.go.run(wasmInstance)
      
    })
  }, [])

  useEffect(() => {
    init()
  }, [init])

  const writeFile = async (e) => {
    //todo change to await
    console.log(e)
    let data = e.target.result.slice();
    await fs.writeFileAsync('/test.pdf', Buffer.from(data))
    let contents = await fs.readFileAsync('/test.pdf')
    console.log(contents)
    go.argv = ['pdfcpu.wasm', 'validate' ,'./test.pdf']
    go.run(wasmInstance)
  }

  const validate = async () => {
    console.log("saving to disk")
    acceptedFiles.map(async file => {
      console.log(file)
      let reader = new FileReader();
      reader.onload = writeFile;
      reader.readAsArrayBuffer(file);
    })
  }
  const test2 = async () => {
    let contents = await fs.readFileAsync('/test.pdf')
    console.log(contents)
  }


  return (
    <div className='App'>
      <ProgressBar style={{ marginBottom: '10px' }} />

      <div className='container'>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      <input type='button' disabled={isProcessing} onClick={mergeFiles} />
      <input type='button' disabled={isProcessing} onClick={test2} />

    </div>
  )
}

// Configures BrowserFS to use the LocalStorage file system.

export default App

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
