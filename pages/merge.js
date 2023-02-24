import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import download from "downloadjs";
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
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import { BFSRequire, configure } from "browserfs";

import DropzoneField from "../components/dropzone";
import DragDrop from "../components/DragDrop";
import { promisifyAll } from "bluebird";
import DonationModal from "../components/DonationModal";
import { downloadFile, readFileAsync, runWasm } from "../components/Helper";
import { NextSeo } from "next-seo";

let fs;
let Buffer;
const Merge = () => {
  const [isMerging, setIsMerging] = useState(false);
  const [files, setFiles] = useState([]);
  const [sorted, SetSorted] = useState(false);
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

  const mergeFiles = async () => {
    setIsMerging(true);
    await mergeOneByOne();
    setIsMerging(false);
    onOpen();
  };

  const mergeOneByOne = async () => {
    if (files.length < 2) return;
    //merge first two files into merge.pdf
    const toastId = toast.loading(`Merging ${files[0].path} ${files[1].path} `);
    console.log(`Merging ${files[0].path} ${files[1].path}`);
    try {
      await readFileAsync(files[0], files, setFiles);
      await readFileAsync(files[1], files, setFiles);
    } catch (error) {
      console.log(error);
      toast.error("There was an error loading your PDFs", {
        id: toastId,
      });
    }

    let exitcode = await runWasm([
      "pdfcpu.wasm",
      "merge",
      "-c",
      "disable",
      "/merge.pdf",
      files[0].path,
      files[1].path,
    ]);
    if (exitcode !== 0) {
      toast.error("There was an error merging your PDFs", {
        id: toastId,
      });
      return;
    }
    await fs.unlinkAsync(files[0].path);
    await fs.unlinkAsync(files[1].path);

    if (files.length === 2) {
      await downloadFile(fs, "merge.pdf");
      await fs.unlinkAsync("./merge.pdf");
      toast.success("Your File ist Ready!", {
        id: toastId,
      });
      setFiles([]);
      return;
    }
    const nextFiles = files.slice(2);
    while (nextFiles.length > 0) {
      await fs.renameSync("./merge.pdf", "./mergetmp.pdf");
      let nextFile = nextFiles.shift();
      toast.loading(`Merging ${files[0].path} ${files[1].path}`, {
        id: toastId,
      });
      try {
        await readFileAsync(nextFile, files, setFiles);
      } catch (error) {
        console.log(error);
        toast.error("There was an error loading your PDFs", {
          id: toastId,
        });
      }

      let exitcode = await runWasm([
        "pdfcpu.wasm",
        "merge",
        "-c",
        "disable",
        "/merge.pdf",
        "./mergetmp.pdf",
        nextFile.path,
      ]);
      if (exitcode !== 0) {
        toast.error("There was an error merging your PDF", {
          id: toastId,
        });
      }
      await fs.unlinkAsync(nextFile.path);
    }
    //finished
    await downloadFile(fs, "merge.pdf");
    toast.success("Your File ist Ready!", {
      id: toastId,
    });
    setFiles([]);
  };

  const LoadingButton = () => {
    if (isMerging) {
      return (
        <>
          <Button
            colorScheme="blue"
            isLoading
            disabled={files.length < 2 || isMerging}
            onClick={mergeFiles}
            variant="outline"
          >
            Merge
          </Button>
        </>
      );
    } else {
      return (
        <Button
          colorScheme="blue"
          variant="outline"
          disabled={files.length < 2 || isMerging}
          onClick={mergeFiles}
        >
          Merge
        </Button>
      );
    }
  };
  const sortAlpabetically = () => {
    let sortedFiles = files;
    sortedFiles.sort((a, b) => a.path.localeCompare(b.path));
    if (sorted) {
      sortedFiles.reverse();
    }
    SetSorted((val) => !val);
    setFiles((prev) => [...sortedFiles]);
  };
  return (
    <>
      <NextSeo
        title="Merge PDF Files with Local PDF"
        description="Local PDF allows you to merge multiple PDF files into one, directly in your browser. No need to upload your files to a third-party server."
        canonical="https://www.localpdf.com/merge"
        openGraph={{
          url: "https://www.localpdf.com/merge",
          title: "Merge PDF Files with Local PDF",
          description:
            "Local PDF allows you to merge multiple PDF files into one, directly in your browser. No need to upload your files to a third-party server.",
          type: "website",
          images: [
            {
              url: "https://www.localpdf.com/og-image-02.jpg",
              width: 1200,
              height: 630,
              alt: "Merge PDF Files with Local PDF",
              type: "image/jpeg",
            },
          ],
          siteName: "Local PDF",
        }}
        twitter={{
          handle: "@localpdf",
          site: "@localpdf",
          cardType: "summary_large_image",
        }}
      />

      <Flex width="full" height="full" align="center" justifyContent="center">
        <Box
          p={8}
          maxWidth={["100%", "95%", "80%"]}
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
              Merge PDFs
            </Heading>
          </Center>
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
                    isMerging={isMerging}
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
            {!sorted ? (
              <Button
                onClick={sortAlpabetically}
                disabled={files.length < 2 || isMerging}
                colorScheme="blue"
                variant="outline"
              >
                Sort
              </Button>
            ) : (
              <Button
                onClick={sortAlpabetically}
                disabled={files.length < 2 || isMerging}
                colorScheme="blue"
                variant="outline"
              >
                Sort A
              </Button>
            )}
            <Spacer />
            <LoadingButton></LoadingButton>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Merge;
