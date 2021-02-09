const sitemap = require('nextjs-sitemap-generator');  
sitemap({  
  baseUrl: 'localpdf.tech',  
  pagesDirectory: __dirname + "/pages",  
  targetDirectory : 'public/'  
});