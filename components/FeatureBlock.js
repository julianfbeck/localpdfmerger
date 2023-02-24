import { Box, Heading, Text, Icon } from "@chakra-ui/react";
import { FaRegFilePdf } from "react-icons/fa";

export default function FeatureBlock({ title, text }) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Icon as={FaRegFilePdf} boxSize={"50px"} color={"green.500"} />
      <Heading as="h1" size="xl" mt={6} mb={2}>
        {title}
      </Heading>
      <Text color={"gray.500"}>{text}</Text>
    </Box>
  );
}
