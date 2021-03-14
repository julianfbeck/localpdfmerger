import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,

  Button,
  VStack,
  Text
} from "@chakra-ui/react";
import { useEffect } from "react";
import DonationButton from "./DonationButton";

const DonationModal = ({ isOpen, onOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your file has been downloaded </ModalHeader>
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
            Support this site ❤️
            </Text>
          </ModalBody>
            <VStack>
              <DonationButton ammount={"5"} itemID="price_1IUx1FJ2iOysJZvP1LD3EzTR"></DonationButton>
              <DonationButton ammount={"10"} itemID="price_1IUx1FJ2iOysJZvP1LD3EzTR"></DonationButton>
              <DonationButton ammount={"20"} itemID="price_1IUx1FJ2iOysJZvP1LD3EzTR"></DonationButton>

            </VStack>

          <ModalFooter>
            <Button variant="outline"  mr={3} onClick={onClose}>
            Don't support me
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DonationModal;
