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
              <DonationButton ammount={"5.00"} itemID="price_1IUw15J2iOysJZvPPgJ1Cgk3"></DonationButton>
              <DonationButton ammount={"10.00"} itemID="price_1IUxxiJ2iOysJZvPiUiePnWK"></DonationButton>
              <DonationButton ammount={"20.00"} itemID="price_1IUxyVJ2iOysJZvPbW7oqAcz"></DonationButton>

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
