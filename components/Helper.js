import download from "downloadjs";
const path = require("path");

export const downloadFile = async (fs, file) => {
  let data = await fs.readFileAsync(file);
  download(new Blob([data]), file);
};

export const readFileAsync = (file, files,setFiles) => {
  return new Promise((resolve, reject) => {
    console.log(`Writing ${file.name} to disk`);
    if (file.isLoaded) return resolve();

    let reader = new FileReader();
    reader.fileName = file.name;

    reader.onload = async (e) => {
      let data = e.target.result.slice();
      await fs.writeFileAsync(`/${e.target.fileName}`, Buffer.from(data));
      let exitCode = await runWasm([
        "pdfcpu.wasm",
        "validate",
        "-c",
        "disable",
        `/${e.target.fileName}`,
      ]);

      if (exitCode !== 0) return reject();
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