import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  VStack,
  Text,
  Progress,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DonationButton from "./DonationButton";

const DonationModal = ({ isOpen, onOpen, onClose }) => {
  const [donations, setDonations] = useState(0);

  useEffect(() => {
    fetch("/api/payment")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDonations(data.total);
      });
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>This Site is completely free</ModalHeader>
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
              Support this site ❤️ by donating!
            </Text>
            <Text mb="2">
              Help me pay for the domain and hosting. The domain currently costs
              $30/year. So far people have donated ${donations}
            </Text>
            <Progress hasStripe value={donations * 3.33} />
          </ModalBody>
          <VStack>
            <DonationButton
              ammount={"5.00"}
              itemID="price_1IUw15J2iOysJZvPPgJ1Cgk3"
            ></DonationButton>
            <DonationButton
              ammount={"10.00"}
              itemID="price_1IUxxiJ2iOysJZvPiUiePnWK"
            ></DonationButton>
            <DonationButton
              ammount={"20.00"}
              itemID="price_1IUxyVJ2iOysJZvPbW7oqAcz"
            ></DonationButton>
          </VStack>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Don't support me
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DonationModal;
