# Localpdf.tech
## Attention:
This Project is one of my first Project and therfore is not well coded. It`s mostly a Proof of Concept and I will probably rewrite sometimes using typescript and a better code structure in general. There is a lot of duplicated code, hacks and other bad practices. Feel free to contribute!
---




<img src="https://raw.githubusercontent.com/jufabeck2202/localpdfmerger/804e32f18b0c26014ff2ab9f6a34afeaadc6d472/public/files.svg" width="30%">

> Local PDF uses Webassembly to edit your PDFs inside your Browser. Your files won't leave your System, they will not be sent to another server

This Website uses [pdfcpu](https://github.com/pdfcpu/pdfcpu "pdfcpu") and is based on [this](https://dev.to/wcchoi/browser-side-pdf-processing-with-go-and-webassembly-13hn "this") article by [wcchoi](https://github.com/wcchoi "wcchoi").

Currently, we support Merging PDFs, optimizing PDFs, and extracting Information like Images from PDF Files as well as adding watermarks!

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
