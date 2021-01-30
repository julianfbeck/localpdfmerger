import React, { useEffect, useMemo, useState, useCallback } from 'react'
import download from 'downloadjs'
import { useDropzone } from 'react-dropzone'
import './App.css'
import {
  progressBarFetch,
  ProgressBar,
  setOriginalFetch
} from 'react-fetch-progressbar'
import { Promise } from 'bluebird'

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


function App () {
  let [oldFiles, setOldFiles] = React.useState()
  const [files, setFiles] = React.useState([])
  const onDrop = React.useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop, accept: 'application/pdf' })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  )

  const fileList = files.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  const getAllFiles = async () => {
    fs.readdir('/', (err, files) => {
      console.log("hi")
      if (files === undefined) {
        setOldFiles(files)
        console.log(files)
      }
    })
  }

  const init = useCallback(async () => {
    BrowserFS.install(window)
    BrowserFS.configure(
      {
        fs: 'LocalStorage'
      },
      async e => {
        if (e) {
          // An error happened!
          throw e
        } else {
          fs = Promise.promisifyAll(BrowserFS.BFSRequire('fs'))
          Buffer = BrowserFS.BFSRequire('buffer').Buffer
          console.log('fileSystem init')
          await getAllFiles()
        }
      }
    )
  }, [])

  useEffect(() => {
    init()
  }, [init])

  const writeFile = async e => {
    //todo change to await
    console.log(e.target.fileName)
    let data = e.target.result.slice()
    await fs.writeFileAsync(`/${e.target.fileName}`, Buffer.from(data))
    await runWasm(['pdfcpu.wasm', 'validate', `/${e.target.fileName}`])
    console.log(global.fs)
  }

  const validate = async () => {
    console.log('saving to disk')
    files.map(async file => {
      let reader = new FileReader()
      reader.fileName = file.name 
      reader.onload = writeFile
      reader.readAsArrayBuffer(file)
      console.log(`Writing ${file.name} to disk`)
    })
  }
  const runWasm = async param => {
    const response = await fetch('pdfcpu.wasm')
    const { instance } = await WebAssembly.instantiateStreaming(
      response,
      window.go.importObject
    )
    window.go.argv = param
    await window.go.run(instance)
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
        <ul>{fileList}</ul>
      </aside>
      <input type='button' onClick={validate} />
      <input type='button' onClick={alert} />
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
