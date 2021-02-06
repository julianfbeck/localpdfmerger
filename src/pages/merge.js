import React, { useEffect, useState, useCallback } from 'react'
import download from 'downloadjs'
import { Button, Stack, Box, Flex } from '@chakra-ui/react'
import '../App.css'
import toast, { Toaster } from 'react-hot-toast'
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'

import DropzoneField from '../components/dropzone'
import DragDrop from '../components/DragDrop'

const path = require('path')
let fs
let Buffer
const Merge = () => {
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

  const downloadFile = async file => {
    let data = await fs.readFileAsync(file)
    download(new Blob([data]), file)
  }

  const readFileAsync = file => {
    return new Promise((resolve, reject) => {
      console.log(`Writing ${file.name} to disk`)
      if (file.isLoaded) return resolve()

      let reader = new FileReader()
      reader.fileName = file.name

      reader.onload = async e => {
        let data = e.target.result.slice()
        await fs.writeFileAsync(`/${e.target.fileName}`, Buffer.from(data))
        let exitCode = await runWasm([
          'pdfcpu.wasm',
          'validate',
          '-c',
          'disable',
          `/${e.target.fileName}`
        ])

        if (exitCode !== 0) return reject()
        let updatedFile = files.map(file => {
          if (file.name === path.basename(e.target.fileName)) {
            file.validated = true
            file.isLoaded = true
          }
          return file
        })
        setFiles(updatedFile)
        resolve(reader.result)
      }

      reader.onerror = reject

      reader.readAsArrayBuffer(file)
    })
  }

  const mergeFiles = async () => {
    setIsMerging(true)
    await mergeOneByOne()
    setIsMerging(false)
  }

  const mergeOneByOne = async () => {
    if (files.length < 2) return
    //merge first two files into merge.pdf
    const toastId = toast.loading(`Merging ${files[0].path} ${files[1].path} `)
    console.log(`Merging ${files[0].path} ${files[1].path}`)
    //toast start
    try {
      await readFileAsync(files[0])
      await readFileAsync(files[1])
    } catch (error) {
      console.log(error)
      //toast
      toast.error('There was an error loading your PDFs', {
        id: toastId
      })
    }

    let exitcode = await runWasm([
      'pdfcpu.wasm',
      'merge',
      '-c',
      'disable',
      '/merge.pdf',
      files[0].path,
      files[1].path
    ])
    if (exitcode !== 0) {
      //toast
      toast.error('There was an error merging your PDFs', {
        id: toastId
      })
      return
    }
    await fs.unlinkAsync(files[0].path)
    await fs.unlinkAsync(files[1].path)

    if (files.length === 2) {
      await downloadFile(`merge.pdf`)
      await fs.unlinkAsync('./merge.pdf')
      toast.success('Your File ist Ready!', {
        id: toastId
      })
      return
    }
    const nextFiles = files.slice(2)
    while (nextFiles.length > 0) {
      await fs.renameSync('./merge.pdf', './mergetmp.pdf')
      let nextFile = nextFiles.shift()
      toast.loading(`Merging ${files[0].path} ${files[1].path}`, {
        id: toastId
      })
      try {
        await readFileAsync(nextFile)
      } catch (error) {
        console.log(error)
        toast.error('There was an error loading your PDFs', {
          id: toastId
        })
      }

      let exitcode = await runWasm([
        'pdfcpu.wasm',
        'merge',
        '-c',
        'disable',
        '/merge.pdf',
        './mergetmp.pdf',
        nextFile.path
      ])
      if (exitcode !== 0) {
        toast.error('There was an error merging your PDF', {
          id: toastId
        })
      }
      await fs.unlinkAsync(nextFile.path)
    }
    //finished
    await downloadFile(`merge.pdf`)
    toast.success('Your File ist Ready!', {
      id: toastId
    })
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
  const sortAlpabetically = () => {
    let sortedFiles = files
    sortedFiles.sort((a, b) => a.path.localeCompare(b.path))
    if (sorted) {
      sortedFiles.reverse()
    }
    SetSorted(val => !val)
    setFiles(prev => [...sortedFiles])
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
          <Toaster />
          <aside>
            <Stack spacing={8} m={3}>
              <div className={`${files.length > 3 ? 'customList' : ''}`}>
                <DragDrop setState={setFiles} state={files}></DragDrop>
              </div>
            </Stack>
          </aside>
          <Flex spacing='6'>
            <div>
              {sorted ? (
                <Button
                  rightIcon={<ArrowUpIcon />}
                  onClick={sortAlpabetically}
                  disabled={files.length < 2}
                  colorScheme='blue'
                  variant='outline'
                >
                  Sort A
                </Button>
              ) : (
                <Button
                  rightIcon={<ArrowDownIcon />}
                  onClick={sortAlpabetically}
                  disabled={files.length < 2}
                  colorScheme='blue'
                  variant='outline'
                >
                  Sort A
                </Button>
              )}
            </div>

            <LoadingButton></LoadingButton>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default Merge
