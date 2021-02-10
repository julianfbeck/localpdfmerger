const sitemap = require('nextjs-sitemap-generator');  
sitemap({  
  baseUrl: 'https://localpdf.tech',  
  pagesDirectory: __dirname + "/pages",  
  targetDirectory : 'public/' ,
  ignoreIndexFiles : true
});