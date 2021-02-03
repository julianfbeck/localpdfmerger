const fs  = require("fs")
let file_fd = fs.openSync('test.pdf', 'r'); 

fs.fstat(file_fd, (error, stats) => { 

    console.log(stats)
  }); 
console.log(new Date())