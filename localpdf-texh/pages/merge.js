import React, { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import download from 'downloadjs'
import {
  Button,
  Stack,
  Box,
  Flex,
  Heading,
  Center,
  Text,
  Spacer,
  Fade
} from '@chakra-ui/react'
import toast, { Toaster } from 'react-hot-toast'
import { BFSRequire, configure } from 'browserfs'
import dynamic from 'next/dynamic'
import ScriptTag from 'react-script-tag'
import * as gtag from '../scripts/gtag'


import DropzoneField from '../components/dropzone'
import DragDrop from '../components/DragDrop'
import { promisifyAll } from 'bluebird'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const path = require('path')
let fs
let Buffer
const test = dynamic(import('../scripts/wasm_exec'))
const breakpoints = createBreakpoints({
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em'
})
const Merge = () => {
  const [isMerging, setIsMerging] = useState(false)
  const [files, setFiles] = React.useState([])
  const [sorted, SetSorted] = React.useState(false)

  const init = useCallback(async () => {
    configure(
      {
        fs: 'InMemory'
      },
      function (e) {
        if (e) {
          // An error happened!
          throw e
        }
        fs = promisifyAll(BFSRequire('fs'))

        Buffer = BFSRequire('buffer').Buffer
        global.fs = fs
        global.Buffer = Buffer
        
      }
    )
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
    gtag.event({
      action: 'merge',
    })
    if (files.length < 2) return
    //merge first two files into merge.pdf
    const toastId = toast.loading(`Merging ${files[0].path} ${files[1].path} `)
    console.log(`Merging ${files[0].path} ${files[1].path}`)
    try {
      await readFileAsync(files[0])
      await readFileAsync(files[1])
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
      files[0].path,
      files[1].path
    ])
    if (exitcode !== 0) {
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
      setFiles([])
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
    setFiles([])
  }

  const runWasm = async param => {
    if (window.cachedWasmResponse === undefined) {
      const response = await fetch('pdfcpu.wasm')
      const buffer = await response.arrayBuffer()
      window.cachedWasmResponse = buffer
      global.go = new Go()
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
            disabled={files.length < 2 || isMerging}
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
          disabled={files.length < 2 || isMerging}
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
    <><Head>
    <title>Merge PDF Files - Combine multible PDF Files into one</title>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <meta name='theme-color' content='#000000' />
    <meta
      name='description'
      content="Merge multible PDFs into one. Your files won't leave your System, Local PDF uses your Browser edit PDfs! Your files will not be send to another server!"
    />
    <meta
      name='keywords'
      content='Merge, PDF, Combine PDF, Local PDF, PDF Tools, Webassembly, pdfcpu'
    />
    <meta name='author' content='Julian Beck' />
  </Head>
      <ScriptTag isHydrating={true} type='text/javascript' src='wasm_exec.js' />
      <Flex width='full' height='full' align='center' justifyContent='center'>
        <Box
          p={8}
          maxWidth={['100%','95%',"80%"]}
          borderWidth={1}
          borderRadius={8}
          boxShadow='lg'
          backgroundColor='white'
        >
          <Center>
            <Heading
              as='h2'
              size='lg'
              fontWeight='bold'
              color='primary.800'
              textAlign={['center', 'center', 'left', 'left']}
              pb={2}
            >
              Merge PDFs
            </Heading>
          </Center>
          <DropzoneField setFiles={setFiles} files={files}></DropzoneField>
          <Toaster />
          <aside>
            <Fade in={files.length !== 0} reverse>
              <Stack spacing={8} m={3}>
                <div className={`${files.length > 3 ? 'customList' : ''}`}>
                  <DragDrop
                    setState={setFiles}
                    state={files}
                    isMerging={isMerging}
                  ></DragDrop>
                </div>
              </Stack>
            </Fade>
          </aside>
          <Text
            fontSize='xs'
            m={2}
            textAlign='center'
            color='primary.800'
            opacity='0.6'
          >
            {files.length === 0 ? '' : 'You can drag and drop files to sort'}
          </Text>
          <Flex row={2}>
            {!sorted ? (
              <Button
                onClick={sortAlpabetically}
                disabled={files.length < 2 || isMerging}
                colorScheme='blue'
                variant='outline'
              >
                Sort
              </Button>
            ) : (
              <Button
                onClick={sortAlpabetically}
                disabled={files.length < 2 || isMerging}
                colorScheme='blue'
                variant='outline'
              >
                Sort A
              </Button>
            )}
            <Spacer />
            <LoadingButton></LoadingButton>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default Merge
