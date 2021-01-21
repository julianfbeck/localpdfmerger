importScripts("https://cdnjs.cloudflare.com/ajax/libs/BrowserFS/2.0.0/browserfs.js");
importScripts("https://cdn.jsdelivr.net/npm/comlinkjs@3.1.1/umd/comlink.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.5.4/bluebird.min.js");

class GoWorker {
    constructor() {
        this.fs = Promise.promisifyAll(BrowserFS.BFSRequire('fs'));
        console.log("GoWorker constructed");
    }

    async validate(buffer) {
        await this.beforeProcess(buffer);
        try {
            this.go.argv = ['pdfcpu.wasm', 'validate', '/test.pdf'];
            var st = Date.now();
            await this.go.run(this.instance);
            console.log('Time taken:', Date.now() - st);

            return this.go.exitCode === 0;
        } catch (e) {
            console.error(e);

            return false;
        }
    }

    async extractPage(buffer, page) {
        await this.beforeProcess(buffer);

        this.go.argv = ['pdfcpu.wasm', 'trim', '-pages', String(page), '/test.pdf', '/first_page.pdf'];
        var st = Date.now();
        await this.go.run(this.instance);
        console.log('Time taken:', Date.now() - st);

        let contents = await this.fs.readFileAsync('/first_page.pdf');
        console.log("after run main:", contents);

        this.fs.unlink('/test.pdf', err => {
            console.log("Removed test.pdf", err);
            this.fs.unlink('/first_page.pdf', err2 => {
                console.log("Removed first_page.pdf", err);
            })
        })

        return contents;
    }
    // Write input to /test.pdf in browser fs
    async beforeProcess(buffer) {
        // we have to new Go() and create a new instance each time
        // because there are states in the go obj that prevent it from running multiple times
        this.go = new Go();

        if(!this.compiledModule) {
            let result = await WebAssembly.instantiateStreaming(fetch("pdfcpu.wasm"), this.go.importObject);
            console.log("wasm module compiled!")
            this.compiledModule = result.module; // cache, so that no need to download next time process is called
            this.instance = result.instance;
        } else {
            this.instance = await WebAssembly.instantiate(this.compiledModule, this.go.importObject);
        }

        await this.fs.writeFileAsync('/test.pdf', Buffer.from(buffer));
        let contents = await this.fs.readFileAsync('/test.pdf');
        console.log(contents);
    }
}

console.log("pre config");
// Configures BrowserFS to use the InMemory file system.
BrowserFS.configure({
    fs: "InMemory"
}, function(e) {
    if (e) {
        // An error happened!
        throw e;
    }
    importScripts('./wasm_exec.js');
    console.log("browserfs initialized!")
    Comlink.expose(GoWorker, self);
});

