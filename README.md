# Localpdf.tech
<img src="https://raw.githubusercontent.com/jufabeck2202/localpdfmerger/804e32f18b0c26014ff2ab9f6a34afeaadc6d472/public/files.svg" width="30%">

> Local PDF uses Webassembly to edit your PDFs inside your Browser. Your files won't leave your System, they will not be send to another server

This Website uses [pdfcpu](https://github.com/pdfcpu/pdfcpu "pdfcpu") and is based on of [this](https://dev.to/wcchoi/browser-side-pdf-processing-with-go-and-webassembly-13hn "this") article by [wcchoi](https://github.com/wcchoi "wcchoi").

Currently, we support merging PDFs. You can combine multiple PDF files into one large File. In the future I want to also support other pdfcpu features in the browser.

## Build using:
- Nextjs 
- Charka-ui as Component Framework
- Caprover to host the Web-App

## Installation: 
```
git clone https://github.com/jufabeck2202/localpdfmerger
cd localpdfmerger
yarn dev
```
