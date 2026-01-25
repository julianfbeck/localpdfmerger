import download from "downloadjs";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
const path = require("path");

export const downloadFile = async (fs, file) => {
  let data = await fs.readFileAsync(file);
  download(new Blob([data]), file);
};

// Convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Convert Base64 to Uint8Array
const base64ToUint8Array = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Decrypt PDF using server-side qpdf (for AES-encrypted PDFs)
const decryptPdf = async (arrayBuffer, filename) => {
  try {
    // First try client-side with pdf-lib (for simple encryption)
    const pdfDoc = await PDFDocument.load(arrayBuffer, { password: "" });
    const decryptedBytes = await pdfDoc.save();
    console.log("PDF decrypted successfully using pdf-lib");
    return decryptedBytes;
  } catch (pdfLibError) {
    console.log("pdf-lib decryption failed, trying server-side qpdf...");
    
    try {
      // Use server-side qpdf for AES-encrypted PDFs
      const base64Data = arrayBufferToBase64(arrayBuffer);
      const response = await fetch("/api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfData: base64Data, filename }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.decrypted) {
          console.log("PDF decrypted successfully using qpdf");
          return base64ToUint8Array(result.decryptedData);
        }
      }
    } catch (serverError) {
      console.log("Server-side decryption failed:", serverError.message);
    }
    
    // Return original if all attempts fail
    console.log("Using original PDF (decryption not possible)");
    return new Uint8Array(arrayBuffer);
  }
};

export const readFileAsync = (file, files, setFiles) => {
  return new Promise((resolve, reject) => {
    console.log(`Writing ${file.name} to disk`);
    if (file.isLoaded) return resolve();

    let reader = new FileReader();
    reader.fileName = file.name;

    reader.onload = async (e) => {
      let data = e.target.result.slice();
      const originalPath = `/${e.target.fileName}`;
      
      // Decrypt PDF before writing to virtual filesystem
      const decryptedData = await decryptPdf(data, e.target.fileName);
      await fs.writeFileAsync(originalPath, Buffer.from(decryptedData));
      
      let exitCode = await runWasm([
        "pdfcpu.wasm",
        "validate",
        "-c",
        "disable",
        "-mode",
        "relaxed",
        originalPath,
      ]);

      // Continue even if validation fails
      if (exitCode !== 0) {
        console.log(`Validation failed for ${e.target.fileName}, attempting to continue anyway`);
      }
      let updatedFile = files.map((file) => {
        if (file.name === path.basename(e.target.fileName)) {
          file.validated = true;
          file.isLoaded = true;
        }
        return file;
      });
      setFiles(updatedFile);
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};

export const downloadAndZipFolder = async (fs, mode, downloadName) => {
  let files = await fs.readdirAsync("./" + mode);
  files = files.map((filename) => {
    return path.join("./" + mode, filename);
  });

  let zip = new JSZip();
  for (let filePath of files) {
    let data = await fs.readFileAsync(filePath);
    await fs.unlinkAsync(filePath);
    zip.file(filePath, data);
  }

  zip.generateAsync({ type: "blob" }).then(function (blob) {
    download(new Blob([blob]), downloadName + ".zip");
  });

  await fs.rmdirAsync("./" + mode);
};

export const runWasm = async (param) => {
  if (window.cachedWasmResponse === undefined) {
    const response = await fetch("pdfcpu.wasm");
    const buffer = await response.arrayBuffer();
    window.cachedWasmResponse = buffer;
    global.go = new Go();
  }
  const { instance } = await WebAssembly.instantiate(
    window.cachedWasmResponse,
    window.go.importObject
  );
  window.go.argv = param;
  await window.go.run(instance);
  return window.go.exitCode;
};
