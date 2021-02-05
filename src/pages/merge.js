import React, { useEffect, useState, useCallback } from 'react'
import download from 'downloadjs'
import { Button, Stack, Box, Flex } from '@chakra-ui/react'
import '../App.css'

import DropzoneField from '../components/dropzone'
import DragDrop from '../components/DragDrop'

const path = require('path')
let fs
let Buffer
const Merge = () => {
  const [validatedFiles, setValidatedFiles] = useState([])
  const [isMerging, setIsMerging] = useState(false)
  const [files, setFiles] = React.useState([])
  const [sorted, SetSorted] = React.useState(false)

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

  const sortAlpabetically = () => {
    let sortedFiles = files
    sortedFiles.sort((a, b) => a.path.localeCompare(b.path))
    if (sorted) {
      sortedFiles.reverse()
    }
    SetSorted(val => !val)
    setFiles(prev => [...sortedFiles])
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
    console.log(`Merging ${validatedFiles[0]} ${validatedFiles[1]} `)

    let exitcode = await runWasm([
      'pdfcpu.wasm',
      'merge',
      '-c',
      'disable',
      '/merge.pdf',
      validatedFiles[0],
      validatedFiles[1]
    ])
    await fs.unlinkAsync(validatedFiles[0])
    await fs.unlinkAsync(validatedFiles[1])

    if (validatedFiles.length == 2) {
      await downloadFile(`merge.pdf`)
      await fs.unlinkAsync('./merge.pdf')
      return
    }
    const nextFiles = validatedFiles.slice(2)
    while (nextFiles.length > 0) {
      await fs.renameSync('./merge.pdf', './mergetmp.pdf')
      let nextFile = nextFiles.shift()
      let exitcode = await runWasm([
        'pdfcpu.wasm',
        'merge',
        '-c',
        'disable',
        '/merge.pdf',
        './mergetmp.pdf',
        nextFile
      ])
      if (exitcode !== 0) return exitcode
      await fs.unlinkAsync(nextFile)
    }
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
            variant='outline'
          >
            Merge
          </Button>
        </>
      )
    } else {
      return (
        <Button
          colorScheme='blue'
          variant='outline'
          disabled={files <= 2}
          onClick={mergeFiles}
        >
          Merge
        </Button>
      )
    }
  }
  return (
    <>
      <Flex width='full' height='full' align='center' justifyContent='center'>
        <Box
          p={8}
          maxWidth='80%'
          borderWidth={1}
          borderRadius={8}
          boxShadow='lg'
          backgroundColor='white'
        >
          <DropzoneField setFiles={setFiles}></DropzoneField>

          <aside>
            <Stack spacing={8} m={3}>
              <div className={`${files.length > 3 ? 'customList' : ''}`}>
                <DragDrop setState={setFiles} state={files}></DragDrop>
              </div>
            </Stack>
          </aside>
          <Flex spacing='6'>
            <Button
              colorScheme='blue'
              variant='outline'
              onClick={sortAlpabetically}
              disabled={files.length < 2}
            >
              Sort Alphabetically
            </Button>
            <Button
              ml={3}
              mr={3}
              colorScheme='blue'
              disabled={files.every(v => v.validated === true)}
              onClick={validate}
              variant='outline'
            >
              validate
            </Button>
            <LoadingButton></LoadingButton>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default Merge
