import React from "react";
import '../App.css'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
    Badge,
    Box,
    Heading,
    Text,
    ButtonGroup,
    IconButton,
    HStack
  } from '@chakra-ui/react'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


function File({ file, index }) {
  return (
    <Draggable draggableId={file.path} index={index}>
      {provided => (
             <Box p={5} className="item" shadow='md' borderWidth='1px' borderRadius={4}
             boxShadow='lg' ref={provided.innerRef}
             {...provided.draggableProps}
             {...provided.dragHandleProps}>
             <HStack spacing='24px'>
               <Heading fontSize='xl'>{file.name}</Heading>
               <Text mt={4}>Size: {bytesToSize(file.size)} </Text>
               
             </HStack>
           </Box>
      )}
    </Draggable>
  );
}

const QuoteList = React.memo(function QuoteList({ files }) {
  return files.map((file, index) => (
    <File file={file} index={index} key={file.path} />
  ));
});

const  DragDrop = ({state, setState}) => {

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const files = reorder(
      state,
      result.source.index,
      result.destination.index
    );

    setState(prev => [...files])
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList files={state} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
function bytesToSize (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes == 0) return '0 Byte'
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  }
export default DragDrop

