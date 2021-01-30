(() => {
    BrowserFS.configure({
        fs: "InMemory"
    }, function(e) {
        if (e) {
            // An error happened!
            throw e;
        }
        fs = Promise.promisifyAll(BrowserFS.BFSRequire('fs'))

        Buffer = BrowserFS.BFSRequire('buffer').Buffer
        global.fs = fs
        global.Buffer = Buffer
    });
    this.go = new Go()
})()