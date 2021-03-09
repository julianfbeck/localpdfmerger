import React, { useMemo, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '100px',
  paddingBottom: "100px",
  paddingLeft:'100px',
  paddingRight:"100px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer'
}

const secondStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '40px',
  paddingBottom: "40px",
  paddingLeft:'100px',
  paddingRight:"100px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer'
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

const DropzoneField = ({ setFiles, files }) => {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map(async file => {
      file.validated = false
    })


    setFiles(prev => {
      let addedFiles = []
      acceptedFiles.forEach(newFile => {
        const fileExist = prev.some(file => file.name === newFile.name);
        if (fileExist) {
          toast.error(`${newFile.name} already exists`);
        } else {
          addedFiles.push(newFile)
        }
      });

      return [...prev, ...addedFiles]
    })
  }, [setFiles, files])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop, accept: 'application/pdf' })

  const style = useMemo(
    () => ({
      ...(files.length === 0 ? baseStyle : secondStyle),
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept, files]
  )

  return (
    <div className='container'>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop PDF files here, or click to select files to merge</p>
      </div>
    </div>
  )
}

export default DropzoneField
