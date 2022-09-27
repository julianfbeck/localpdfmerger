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
  Input,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import { BFSRequire, configure } from "browserfs";
import DropzoneField from "../components/dropzone";
import DragDrop from "../components/DragDrop";
import { promisifyAll } from "bluebird";
import DonationModal from "../components/DonationModal";
import { downloadFile, readFileAsync, runWasm } from "../components/Helper";

let fs;
let Buffer;

const Watermark = () => {
  const [isWatermarking, setIsWatermarking] = useState(false);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const watermarkFiles = async () => {
    setIsWatermarking(true);
    await startWatermarkingFiles();
    setIsWatermarking(false);
    onOpen();
  };

  const startWatermarkingFiles = async () => {
    for (let i in files) {
    
      //merge first two files into merge.pdf
      const toastId = toast.loading(`Loading File ${files[i].path}`);
      try {
        await readFileAsync(files[i], files, setFiles);
      } catch (error) {
        console.log(error);
        toast.error("There was an error loading your PDFs", {
          id: toastId,
        });
      }
      let newFileName =
        files[i].name.replace(/\.[^/.]+$/, "") + "-watermarked.pdf";

      let exitcode = await runWasm([
        "pdfcpu.wasm",
        "stamp",
        "add",
        "-c",
        "disable",
        "-mode",
        "text",
        "--",
        text,
        "",
        files[i].path,
        newFileName,
      ]);

      if (exitcode !== 0) {
        toast.error("There was an error watermarking your PDFs", {
          id: toastId,
        });
        return;
      }
      await fs.unlinkAsync(files[i].path);
      await downloadFile(fs, newFileName);
      await fs.unlinkAsync(newFileName);
      toast.success("Your File ist Ready!", {
        id: toastId,
      });
    }
    setFiles([]);
    return;
  };

  const LoadingButton = () => {
    if (isWatermarking) {
      return (
        <>
          <Button
            colorScheme="blue"
            isLoading
            disabled={isWatermarking || files.length <= 0}
            variant="outline"
          >
            Add
          </Button>
        </>
      );
    } else {
      return (
        <Button
          colorScheme="blue"
          variant="outline"
          disabled={isWatermarking || files.length <= 0 || text == ""}
          onClick={watermarkFiles}
        >
          Add
        </Button>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Watermark PDF Files - Add watermarks on top of your files</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Add watermarks to your PDF files, watermark pdfs"
        />
        <meta
          name="keywords"
          content="Watermark, add Watermarks, local, Watermark to pdf"
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
              Add Watermark
            </Heading>
          </Center>
          <Text px={[1, 10, 15]} pb={6}>
            Add a watermark or so called stamp to your pdf. The watermark
            appears in front of the existing page content - sitting on top of
            everything else on a page at a fixed position.
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
                    isMerging={isWatermarking}
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
            <Input
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter Watermark Text"
              mr={5}
            ></Input>
            <Spacer />
            <LoadingButton></LoadingButton>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Watermark;
