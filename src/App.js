import React, { useEffect, useMemo, useState, useCallback } from 'react'
import MergeProgress from './components/progress'
import DropzoneField from './components/dropzone'

import {
  ChakraProvider,
  Button,
  Badge,
  Stack,
  Box,
  Heading,
  Text,
  ButtonGroup,
  IconButton,
  HStack
} from '@chakra-ui/react'
import download from 'downloadjs'
import './App.css'
import {
  progressBarFetch,
  ProgressBar,
  setOriginalFetch
} from 'react-fetch-progressbar'
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'

const path = require('path')

setOriginalFetch(window.fetch)
window.fetch = progressBarFetch

//global variables outside
let fs
let Buffer

function App () {
  const [validatedFiles, setValidatedFiles] = useState([])
  const [isMerging, setIsMerging] = useState(false)
  const [files, setFiles] = React.useState([])

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
      '-c',
      'disable',
      `/${e.target.fileName}`
    ])
    console.log(exitCode)

    if (exitCode !== 0) return
    setValidatedFiles(oldArray => [...oldArray, `/${e.target.fileName}`])
    let updatedFile = files.map(file => {
      if (file.name === path.basename(e.target.fileName)) {
        file.validated = true
      }
      return file
    })
    setFiles(updatedFile)
  }

  const downloadFile = async file => {
    let data = await fs.readFileAsync(file)
    download(new Blob([data]), file)
  }

  const validate = async () => {
    console.log('saving to disk')
    files.map(async file => {
      if (file.validated) return

      let reader = new FileReader()
      reader.fileName = file.name
      reader.onload = writeFile
      reader.readAsArrayBuffer(file)
      console.log(`Writing ${file.name} to disk`)
    })
  }

  const mergeFiles = async () => {
    setIsMerging(true)
    await mergeOneByOne()
    setIsMerging(false)
  }

  const mergeOneByOne = async () => {
    if (validatedFiles.length < 2) return
    //merge first two files into merge.pdf
    let exitcode = await runWasm([
      'pdfcpu.wasm',
      'merge',
      '-c',
      'disable',
      '/merge.pdf',
      validatedFiles[0],
      validatedFiles[1]
    ])
    //unlink those files
    await fs.unlinkAsync(validatedFiles[0])
    await fs.unlinkAsync(validatedFiles[1])
    if (exitcode !== 0) return exitcode
    //cut first two files
    let toMerge = validatedFiles.slice(2)
    toMerge.map(async file => {
      console.log(file)
      let exitcode = await runWasm([
        'pdfcpu.wasm',
        'merge',
        '-m',
        'append',
        '-c',
        'disable',
        '/merge.pdf',
        file
      ])
      await fs.unlinkAsync(file)
      if (exitcode !== 0) return exitcode
    })
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

  const LoadingButton = () => {
    if (isMerging) {
      return (
        <>
          <Button
            colorScheme='blue'
            isLoading
            disabled={files <= 2}
            onClick={mergeFiles}
          >
            Merge
          </Button>
        </>
      )
    } else {
      return (
        <Button colorScheme='blue' disabled={files <= 2} onClick={mergeFiles}>
          Merge
        </Button>
      )
    }
  }

  return (
    <ChakraProvider>
      <div className='App'>
        <ProgressBar style={{ marginBottom: '10px' }} />

        <DropzoneField setFiles={setFiles}></DropzoneField>
        <Button colorScheme='blue'>Sort Alphabetically</Button>
        <aside>
          <Stack spacing={8} m={3}>
            {fileList}
          </Stack>
        </aside>
        <ButtonGroup spacing='6'>
          <Button
            colorScheme='blue'
            disabled={files.every(v => v.validated === true)}
            onClick={validate}
          >
            validate
          </Button>
          <LoadingButton></LoadingButton>
        </ButtonGroup>
      </div>
    </ChakraProvider>
  )
}

// Configures BrowserFS to use the LocalStorage file system.

function FileComp ({ file, size, validated }) {
  return (
    <Box p={5} shadow='md' borderWidth='1px'>
      <HStack spacing='24px'>
        <Heading fontSize='xl'>{file}</Heading>
        <Text mt={4}>Size: {bytesToSize(size)}</Text>
        <ValidatedBage validated={validated}></ValidatedBage>
        <ButtonGroup size='sm' isAttached variant='outline'>
          <IconButton aria-label='Up' icon={<ArrowUpIcon />} />
          <IconButton aria-label='Down' icon={<ArrowDownIcon />} />
        </ButtonGroup>
      </HStack>
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
function bytesToSize (bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}
export default App
