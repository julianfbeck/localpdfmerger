import React, { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import {
  Button,
  Stack,
  Box,
  Flex,
  Heading,
  Center,
  Text,
  Spacer,
  Fade,
  useDisclosure,
  Select,
  Container,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import { BFSRequire, configure } from "browserfs";
import * as gtag from "../scripts/gtag";
import DropzoneField from "../components/dropzone";
import DragDrop from "../components/DragDrop";
import { promisifyAll } from "bluebird";
import DonationModal from "../components/DonationModal";
import {
  downloadFile,
  readFileAsync,
  runWasm,
  downloadAndZipFolder,
} from "../components/Helper";
let fs;
let Buffer;

const Extract = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [files, setFiles] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mode, setMode] = useState("");
  const init = useCallback(async () => {
    configure(
      {
        fs: "InMemory",
      },
      function (e) {
        if (e) {
          // An error happened!
          throw e;
        }
        fs = promisifyAll(BFSRequire("fs"));

        Buffer = BFSRequire("buffer").Buffer;
        global.fs = fs;
        global.Buffer = Buffer;
        const script = document.createElement("script");

        script.src = "wasm_exec.js";
        script.async = true;

        document.body.appendChild(script);
      }
    );
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const optimizeFiles = async () => {
    setIsOptimizing(true);
    await startOptimizingFiles();
    setIsOptimizing(false);
    onOpen();
  };

  const selectedValues = async (target) => {
    setMode(target)
  } 
  const startOptimizingFiles = async () => {
    gtag.event({
      action: "extract",
    });
    //merge first two files into merge.pdf
    const toastId = toast.loading(`Loading File ${files[0].path}`);
    try {
      await readFileAsync(files[0], files, setFiles);
    } catch (error) {
      console.log(error);
      toast.error("There was an error loading your PDFs", {
        id: toastId,
      });
    }
    await fs.mkdirAsync("./images");

    let exitcode = await runWasm([
      "pdfcpu.wasm",
      "extract",
      "-m",
      "image",
      "-c",
      "disable",
      files[0].path,
      "./images",
    ]);

    if (exitcode !== 0) {
      toast.error("There was an error optimizing your PDFs", {
        id: toastId,
      });
      return;
    }
    await fs.unlinkAsync(files[0].path);
    await downloadAndZipFolder(fs, "./images", "images");
    toast.success("Your File ist Ready!", {
      id: toastId,
    });

    setFiles([]);
    return;
  };

  const LoadingButton = () => {
    if (isOptimizing) {
      return (
        <>
          <Button
            colorScheme="blue"
            isLoading
            disabled={isOptimizing}
            variant="outline"
          >
            Optimize Files
          </Button>
        </>
      );
    } else {
      return (
        <Button
          colorScheme="blue"
          variant="outline"
          disabled={isOptimizing || mode ==""}
          onClick={optimizeFiles}
        >
          Optimize Files
        </Button>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Optimize PDF Files - Get rid of redundant page resources</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Get rid of redundant page resources like embedded fonts and images and download the results with better PDF compression."
        />
        <meta
          name="keywords"
          content="Optimize, PDF, Optimize PDF, Local PDF, PDF Tools, Webassembly, pdfcpu, redundant, page, resources, embedded, fonts, compression"
        />
        <meta name="author" content="Julian Beck" />
      </Head>
      <Flex width="full" height="full" align="center" justifyContent="center">
        <Box
          p={8}
          maxWidth={["100%", "95%", "70%", "50%"]}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          backgroundColor="white"
        >
          <Center>
            <Heading
              as="h2"
              size="lg"
              fontWeight="bold"
              color="primary.800"
              textAlign={["center", "center", "left", "left"]}
              pb={2}
            >
              Optimize PDFs
            </Heading>
          </Center>
          <Text px={[1, 10, 15]} pb={6}>
            Get rid of redundant page resources like embedded fonts and images
            and download the results with better PDF compression.
          </Text>
          <DropzoneField setFiles={setFiles} files={files}></DropzoneField>
          <Toaster />
          <DonationModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          ></DonationModal>
          <aside>
            <Fade in={files.length !== 0} reverse>
              <Stack spacing={8} m={3}>
                <div className={`${files.length > 3 ? "customList" : ""}`}>
                  <DragDrop
                    setState={setFiles}
                    state={files}
                    isMerging={isOptimizing}
                  ></DragDrop>
                </div>
              </Stack>
            </Fade>
          </aside>
          <Text
            fontSize="xs"
            m={2}
            textAlign="center"
            color="primary.800"
            opacity="0.6"
          >
            {files.length === 0 ? "" : "You can drag and drop files to sort"}
          </Text>
          <Flex row={2}>
          <Container maxW="sm">
            <Select onChange={(e) => selectedValues(e.target.value)} colorScheme="blue" placeholder="Select extract Mode" variant="outline">
              <option value="image">Extract All Images</option>
              <option value="meta">Extract Meta Information</option>
              <option value="content">Extract Text</option>
              <option value="pages">Extract all Pages</option>
            </Select>
            </Container>
            <Spacer />
            <LoadingButton></LoadingButton>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Extract;
