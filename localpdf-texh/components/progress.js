import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Progress
} from '@chakra-ui/react'
import React from 'react';

const MergeProgress = ({ value}) => {
  return (
      <AlertDialog

        isOpen={true}
        isCentered
        closeOnEsc={false}
      >

        <AlertDialogContent>
          <AlertDialogHeader>Merging files</AlertDialogHeader>
          <AlertDialogBody>
          <Progress m={2} isAnimated hasStripe value={value} />
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>

  )
}

export default MergeProgress
