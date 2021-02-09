import React from 'react'
//import '../App.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Box, Heading, Text, Flex, Spacer } from '@chakra-ui/react'
import { GetServerSideProps } from "next";
import { resetServerContext } from "react-beautiful-dnd";
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}



export const getServerSideProps = async (context) => {
  resetServerContext();
  return { props: {} };
};

function File ({ file, index, isMerging}) {
  return (
    <Draggable draggableId={file.path} index={index} isDragDisabled ={isMerging}>
      {provided => (
        <Box
          p={5}
          className='item'
          shadow='md'
          borderWidth='1px'
          borderRadius={4}
          boxShadow='lg'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
            <Flex>
              <Heading fontSize='xl'>{file.name}</Heading>
              <Spacer></Spacer>
              <Text>Size: {bytesToSize(file.size)} </Text>
            </Flex>

        </Box>
      )}
    </Draggable>
  )
}

const QuoteList = React.memo(function QuoteList ({ files, isMerging }) {
  return files.map((file, index) => (
    <File file={file} index={index} key={file.path} isMerging={isMerging} />
  ))
})

const DragDrop = ({ state, setState, isMerging }) => {
  function onDragEnd (result) {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const files = reorder(state, result.source.index, result.destination.index)

    setState(prev => [...files])
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='list'>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList files={state} isMerging={isMerging} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
function bytesToSize (bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}
export default DragDrop
