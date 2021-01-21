## Running a command line tool written in Go on browser with WebAssembly

This repo contains code/assets from the [article](article.md)

Files:
```
.
├── article.md           ---  Article explaining the code
├── index.html           ---  Demo UI page
├── worker.js            ---  JS code for Demo UI Page
├── oldindex.html        ---  Code from the article
├── pdfcpu               ---  Linux x86_64 native binary
├── pdfcpu.wasm          ---  Compiled wasm module of pdfcpu
├── pdfcpu.wasm.br       ---  Brotli compression output
├── pdfcpu.wasm.gz       ---  Gzip compression output
├── README.md            ---  This file
├── static_server.js     ---  A simple HTTP static file server in Node.js, with wasm MIME type support for development
├── wasm_exec.js.orig    ---  Original wasm_exec.js from Go v1.12.4 installation (misc/wasm), for diff'ing changes
└── wasm_exec.js         ---  Modified to add Filesystem emulation support in browser with BrowserFS
```

