import React, { useEffect, useState, useCallback } from "react";
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
import DropzoneField from "../components/dropzone";
import DragDrop from "../components/DragDrop";
import { promisifyAll } from "bluebird";
import DonationModal from "../components/DonationModal";
import {
  readFileAsync,
  runWasm,
  downloadAndZipFolder,
} from "../components/Helper";
import FeatureBlock from "../components/FeatureBlock";
import { NextSeo } from "next-seo";
let fs;
let Buffer;

const Extract = () => {
  const [isExtracting, setIsExtracting] = useState(false);
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

  const extractFiles = async () => {
    setIsExtracting(true);
    await startExtractingFiles();
    setIsExtracting(false);
    onOpen();
  };

  const selectedValues = async (target) => {
    setMode(target);
  };

  const startExtractingFiles = async () => {
    const toastId = toast.loading(`Loading File ${files[0].path}`);
    for (let i in files) {
      //merge first two files into merge.pdf
      try {
        await readFileAsync(files[i], files, setFiles);
      } catch (error) {
        console.log(error);
        toast.error("There was an error loading your PDFs", {
          id: toastId,
        });
      }
      await fs.mkdirAsync("./" + mode);

      let exitcode = await runWasm([
        "pdfcpu.wasm",
        "extract",
        "-m",
        mode,
        "-c",
        "disable",
        files[i].path,
        "./" + mode,
      ]);

      if (exitcode !== 0) {
        toast.error("There was an error extracting Files from your PDFs", {
          id: toastId,
        });
        return;
      }
      await fs.unlinkAsync(files[i].path);
      await downloadAndZipFolder(fs, mode, files[i].name);
    }
    toast.success("Your File(s) is Ready!", {
      id: toastId,
    });
    setFiles([]);
    return;
  };

  const LoadingButton = () => {
    if (isExtracting) {
      return (
        <>
          <Button
            colorScheme="blue"
            isLoading
            disabled={isExtracting}
            variant="outline"
          >
            Extract
          </Button>
        </>
      );
    } else {
      return (
        <Button
          colorScheme="blue"
          variant="outline"
          disabled={isExtracting || mode == "" || files.length == 0}
          onClick={extractFiles}
        >
          Extract
        </Button>
      );
    }
  };
  const modeText = () => {
    if (mode == "") {
      return (
        <Text px={[1, 10, 15]} pb={6}>
          Extract Information from your PDF file. You can extract Images, Meta
          Information, Text, Fonts and Pages from your PDF file
        </Text>
      );
    } else if (mode == "image") {
      return (
        <Text px={[1, 10, 15]} pb={6}>
          Extract all images from your PDF files:
        </Text>
      );
    } else if (mode == "meta") {
      return (
        <Text px={[1, 10, 15]} pb={6}>
          Extract the Meta-Information of your PDF-file
        </Text>
      );
    } else if (mode == "content") {
      return (
        <Text px={[1, 10, 15]} pb={6}>
          Extract the Content of your PDF. This will download all Text of your
          PDF as a .txt File
        </Text>
      );
    } else if (mode == "pages") {
      return (
        <Text px={[1, 10, 15]} pb={6}>
          Extract all Pages from your PDF file
        </Text>
      );
    } else if (mode == "font") {
      return (
        <Text px={[1, 10, 15]} pb={6}>
          Extract all Fonts Formats from your PDF File
        </Text>
      );
    }
  };

  return (
    <>
      <NextSeo
        title="Extract PDF Information with Local PDF"
        description="Extract Images, Text, Meta Information, Fonts and Pages from your PDF files directly in your browser. No need to upload your files to a third-party server."
        canonical="https://www.localpdf.com/extract"
        openGraph={{
          url: "https://www.localpdf.com/extract",
          title: "Extract PDF Information with Local PDF",
          description:
            "Extract Images, Text, Meta Information, Fonts and Pages from your PDF files directly in your browser. No need to upload your files to a third-party server.",
          type: "website",
          images: [
            {
              url: "https://www.localpdf.com/og-image-01.jpg",
              width: 1200,
              height: 630,
              alt: "Local PDF allows you to extract information, such as images, from your PDF files directly in your browser. No need to upload your files to a third-party server.",
              type: "image/jpeg",
            },
          ],
          siteName: "Local PDF",
        }}
        twitter={{
          handle: "@julianfbeck",
          site: "@julianfbeck",
          cardType: "summary_large_image",
        }}
      />

      <Flex width="full" height="full" align="center" justifyContent="center">
        <Box
          p={8}
          maxWidth={["100%", "95%", "70%", "50%"]}
          width={["100%", "95%", "70%", "50%"]}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          backgroundColor="white"
        >
          <Center>
            <FeatureBlock />
          </Center>
          {modeText()}
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
                    isMerging={isExtracting}
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
              <Select
                onChange={(e) => selectedValues(e.target.value)}
                colorScheme="blue"
                placeholder="Select Information to Extract"
                variant="outline"
              >
                <option value="image">Extract All Images</option>
                <option value="meta">Extract Meta Information</option>
                <option value="content">Extract Text</option>
                <option value="page">Extract all Pages</option>
                <option value="font">Extract all Font Types</option>
              </Select>
            </Container>
            <Spacer />
            <LoadingButton />
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Extract;
