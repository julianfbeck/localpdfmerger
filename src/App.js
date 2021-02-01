import React, { useEffect, useMemo, useState, useCallback } from 'react'

import {
  ChakraProvider,
  Button,
  Badge,
  Stack,
  Box,
  Heading,
  Text,
  ButtonGroup
} from '@chakra-ui/react'
import download from 'downloadjs'
import { useDropzone } from 'react-dropzone'
import './App.css'
import {
  progressBarFetch,
  ProgressBar,
  setOriginalFetch
} from 'react-fetch-progressbar'
const path = require('path')

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
  const [validatedFiles, setValidatedFiles] = useState([])
  const [files, setFiles] = React.useState([])
  const onDrop = React.useCallback(acceptedFiles => {
    acceptedFiles.map(async file => {
      file.validated = false
    })
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
    <FileComp
      key={file.path}
      file={file.path}
      size={file.size}
      validated={file.validated}
    ></FileComp>
  ))

  const init = useCallback(async () => {
    fs = global.fs
    Buffer = global.Buffer
  }, [])

  useEffect(() => {
    init()
  }, [init])

  const writeFile = async e => {
    //todo change to await
    let data = e.target.result.slice()
    await fs.writeFileAsync(`/${e.target.fileName}`, Buffer.from(data))
    let exitCode = await runWasm([
      'pdfcpu.wasm',
      'validate',
      `/${e.target.fileName}`
    ])
    if (exitCode !== 0) return

    setValidatedFiles(oldArray => [...oldArray, `/${e.target.fileName}`])
    let updatedFile = files.map(file => {
      console.log(files)
      if (file.name === path.basename(e.target.fileName)) {
        file.validated = true
      }
      return file
    })
    console.log(updatedFile)
    setFiles(prev => updatedFile)
  }

  const downloadFile = async file => {
    let data = await fs.readFileAsync(file)
    download(new Blob([data]), file)
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
  const mergeFiles = async () => {
    let exitcode = await runWasm([
      'pdfcpu.wasm',
      'merge',
      '/merge.pdf',
      ...validatedFiles
    ])
    if (exitcode !== 0) return
    await downloadFile(`merge.pdf`)
  }
  const runWasm = async param => {
    if (window.cachedWasmResponse === undefined) {
      const response = await fetch('pdfcpu.wasm')
      const buffer = await response.arrayBuffer()
      window.cachedWasmResponse = buffer
    }
    const { instance } = await WebAssembly.instantiate(
      window.cachedWasmResponse,
      window.go.importObject
    )
    window.go.argv = param
    await window.go.run(instance)
    return window.go.exitCode
  }

  return (
    <ChakraProvider>
      <div className='App'>
        <ProgressBar style={{ marginBottom: '10px' }} />

        <div className='container'>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </div>
        <aside>
          <Stack spacing={8} m={3}>
            {fileList}
          </Stack>
        </aside>
        <ButtonGroup variant='outline' spacing='6'>
          <Button
            colorScheme='blue'
            disabled={files.every(v => v.validated === true)}
            onClick={validate}
          >
            validate
          </Button>
          <Button colorScheme='blue' disabled={files <= 2} onClick={mergeFiles}>
            Merge
          </Button>
        </ButtonGroup>
      </div>
    </ChakraProvider>
  )
}

// Configures BrowserFS to use the LocalStorage file system.

function FileComp ({ file, size, validated }) {
  return (
    <Box p={5} shadow='md' borderWidth='1px'>
      <Heading fontSize='xl'>{file}</Heading>
      <Text mt={4}>Size: {bytesToSize(size)}</Text>
      <ValidatedBage validated={validated}></ValidatedBage>
    </Box>
  )
}
function ValidatedBage ({ validated }) {
  if (validated) {
    return (
      <Badge variant='solid' colorScheme='green'>
        Validated
      </Badge>
    )
  } else {
    return (
      <Badge variant='solid' colorScheme='red'>
        Not Validated
      </Badge>
    )
  }
}
function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
export default App
