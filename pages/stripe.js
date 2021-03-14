// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {Button, useDisclosure} from '@chakra-ui/react'
import DonationModal from "../components/DonationModal";


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.


export default function Stripe() {
  const { isOpen, onOpen, onClose } = useDisclosure();

 

  return (<><DonationModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} ></DonationModal>
  <Button onClick={onOpen} >Test</Button>
  </>);
}

