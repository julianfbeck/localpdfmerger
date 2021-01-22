import './App.css'
import { useEffect } from 'react'
import {GoWorker} from "./worker"
import download from "downloadjs"
import {useDropzone} from 'react-dropzone';


function App () {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    
    if (!WebAssembly.instantiateStreaming) {
      // polyfill
      WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer()
        return await WebAssembly.instantiate(source, importObject)
      }
    }
  }, [])
  
  useEffect(async () => {
    console.log(acceptedFiles)
    await processPDFs(acceptedFiles[0])
  }, [acceptedFiles])


  async function processPDFs (file) {
    let worker = await new GoWorker();
    let st = Date.now()
    let reader = new FileReader()
    async function callback (e) {

      let buffer = e.target.result.slice()

      st = Date.now()
      let result = await worker.validate(buffer)
      if (!result) {
        return
      }

      st = Date.now()
      // FIXME: extra copying of buffer
      buffer = e.target.result.slice()
      try {
        result = await worker.extractPage(buffer, 1)

        download(new Blob([result]), 'first_page.pdf')
      } catch (e) {
        console.log('caught in index.html!', e)
      }
    }
    reader.onload = callback
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className='App'>
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
    </div>
  )
}

export default App
