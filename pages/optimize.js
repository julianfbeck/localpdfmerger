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
  Fade,
  useDisclosure
} from '@chakra-ui/react'
import toast, { Toaster } from 'react-hot-toast'
import { BFSRequire, configure } from 'browserfs'
import dynamic from 'next/dynamic'
import * as gtag from '../scripts/gtag'


import DropzoneField from '../components/dropzone'
import DragDrop from '../components/DragDrop'
import { promisifyAll } from 'bluebird'
import { createBreakpoints } from '@chakra-ui/theme-tools'
import DonationModal from '../components/DonationModal'
const path = require('path')
const jszip = require("jszip")

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
const Optimize = () => {
  const [isMerging, setIsMerging] = useState(false)
  const [files, setFiles] = useState([])
  const [sorted, SetSorted] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();


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
        const script = document.createElement('script');

        script.src = "wasm_exec.js";
        script.async = true;
      
        document.body.appendChild(script);
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
    onOpen()
  }

  const mergeOneByOne = async () => {
    console.log(files[0])
    gtag.event({
      action: 'optimize',
    })
    //merge first two files into merge.pdf
    const toastId = toast.loading(`Loading File ${files[0].path}`)
    try {
      await readFileAsync(files[0])
    } catch (error) {
      console.log(error)
      toast.error('There was an error loading your PDFs', {
        id: toastId
      })
    }
    let newFileName = files[0].name.replace(/\.[^/.]+$/, "")+"-optimized.pdf"
    let exitcode = await runWasm([
      'pdfcpu.wasm',
      'optimize',
      '-c',
      'disable',
      files[0].path,
      newFileName
    ])

    if (exitcode !== 0) {
      toast.error('There was an error merging your PDFs', {
        id: toastId
      })
      return
    }
    await fs.unlinkAsync(files[0].path)
      await downloadFile(newFileName)
      await fs.unlinkAsync(newFileName)
      toast.success('Your File ist Ready!', {
        id: toastId
      })
      setFiles([])
      return
  
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
            disabled={isMerging}
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
          disabled={isMerging}
          onClick={mergeFiles}
        >
          Merge
        </Button>
      )
    }
  }

  return (
    <><Head>
    <title>Merge PDF Files - Combine multiple PDF Files into one</title>
    <meta charSet='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <meta name='theme-color' content='#000000' />
    <meta
      name='description'
      content="Merge multiple PDFs into one. Your files won't leave your System, Local PDF uses your Browser edit PDfs! Your files will not be send to another server!"
    />
    <meta
      name='keywords'
      content='Merge, PDF, Combine PDF, Local PDF, PDF Tools, Webassembly, pdfcpu'
    />
    <meta name='author' content='Julian Beck' />
  </Head>
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
          <DonationModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} ></DonationModal>
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
            <Spacer />
            <LoadingButton></LoadingButton>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default Optimize
